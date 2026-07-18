package com.packerstech.repository;

import com.packerstech.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySku(String sku);

    boolean existsBySku(String sku);

    List<Product> findByProductNameContainingIgnoreCase(String keyword);

    @Query("SELECT p FROM Product p WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           " LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.sku) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.supplier) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:category IS NULL OR :category = '' OR p.category = :category) " +
           "AND (:supplier IS NULL OR :supplier = '' OR p.supplier = :supplier) " +
           "AND (:stockStatus IS NULL OR :stockStatus = '' OR " +
           "     (:stockStatus = 'OUT_OF_STOCK' AND p.openingQuantity = 0) OR " +
           "     (:stockStatus = 'LOW_STOCK' AND p.openingQuantity > 0 AND p.openingQuantity <= p.minimumStockLevel) OR " +
           "     (:stockStatus = 'GOOD' AND p.openingQuantity > p.minimumStockLevel)) " +
           "AND (:minPrice IS NULL OR p.sellingPrice >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.sellingPrice <= :maxPrice) " +
           "ORDER BY p.updatedAt DESC")
    List<Product> searchAndFilter(
            @Param("keyword") String keyword,
            @Param("category") String category,
            @Param("supplier") String supplier,
            @Param("stockStatus") String stockStatus,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice
    );

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL AND p.category <> '' ORDER BY p.category")
    List<String> findDistinctCategories();

    @Query("SELECT DISTINCT p.supplier FROM Product p WHERE p.supplier IS NOT NULL AND p.supplier <> '' ORDER BY p.supplier")
    List<String> findDistinctSuppliers();
}
