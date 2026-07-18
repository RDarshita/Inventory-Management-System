package com.packerstech.service;

import com.packerstech.dto.ProductRequest;
import com.packerstech.dto.ProductResponse;

import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductRequest request);
    ProductResponse updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
    ProductResponse getProductById(Long id);
    List<ProductResponse> getAllProducts();
    List<ProductResponse> searchProducts(String keyword);
    List<ProductResponse> searchAndFilter(String keyword, String category, String supplier, String stockStatus, Double minPrice, Double maxPrice);
    List<String> getDistinctCategories();
    List<String> getDistinctSuppliers();
}
