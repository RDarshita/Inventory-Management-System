package com.packerstech.service.impl;

import com.packerstech.dto.ProductRequest;
import com.packerstech.dto.ProductResponse;
import com.packerstech.entity.Product;
import com.packerstech.exception.DuplicateResourceException;
import com.packerstech.exception.ResourceNotFoundException;
import com.packerstech.repository.ProductRepository;
import com.packerstech.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("Product with SKU " + request.getSku() + " already exists.");
        }

        Product product = mapToEntity(request);
        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Check if SKU is being changed to one that already exists
        if (!existingProduct.getSku().equals(request.getSku()) && productRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("Product with SKU " + request.getSku() + " already exists.");
        }

        existingProduct.setProductName(request.getProductName());
        existingProduct.setSku(request.getSku());
        existingProduct.setDescription(request.getDescription());
        existingProduct.setCategory(request.getCategory());
        existingProduct.setSupplier(request.getSupplier());
        existingProduct.setPurchasePrice(request.getPurchasePrice());
        existingProduct.setSellingPrice(request.getSellingPrice());
        existingProduct.setOpeningQuantity(request.getOpeningQuantity());
        existingProduct.setMinimumStockLevel(request.getMinimumStockLevel());

        Product updatedProduct = productRepository.save(existingProduct);
        return mapToResponse(updatedProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToResponse(product);
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> searchProducts(String keyword) {
        return productRepository.findByProductNameContainingIgnoreCase(keyword).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private Product mapToEntity(ProductRequest request) {
        return Product.builder()
                .productName(request.getProductName())
                .sku(request.getSku())
                .description(request.getDescription())
                .category(request.getCategory())
                .supplier(request.getSupplier())
                .purchasePrice(request.getPurchasePrice())
                .sellingPrice(request.getSellingPrice())
                .openingQuantity(request.getOpeningQuantity())
                .minimumStockLevel(request.getMinimumStockLevel())
                .build();
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .productName(product.getProductName())
                .sku(product.getSku())
                .description(product.getDescription())
                .category(product.getCategory())
                .supplier(product.getSupplier())
                .purchasePrice(product.getPurchasePrice())
                .sellingPrice(product.getSellingPrice())
                .openingQuantity(product.getOpeningQuantity())
                .minimumStockLevel(product.getMinimumStockLevel())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    @Override
    public List<ProductResponse> searchAndFilter(String keyword, String category, String supplier, String stockStatus, Double minPrice, Double maxPrice) {
        return productRepository.searchAndFilter(keyword, category, supplier, stockStatus, minPrice, maxPrice).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getDistinctCategories() {
        return productRepository.findDistinctCategories();
    }

    @Override
    public List<String> getDistinctSuppliers() {
        return productRepository.findDistinctSuppliers();
    }
}
