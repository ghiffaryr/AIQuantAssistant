package com.ghiffaryr.store.repository;

import com.ghiffaryr.store.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Product findByProductCode(String productCode);

    Page<Product> findAllByProductStatusOrderByProductCodeAsc(Integer productStatus, Pageable pageable);

    Page<Product> findAllByProductCategoryCodeOrderByProductCodeAsc(String productCategoryCode, Pageable pageable);

    Page<Product> findAllByProductStatusAndProductCategoryCodeOrderByProductCodeAsc(Integer productStatus, String productCategoryCode, Pageable pageable);

    Page<Product> findAllByOrderByProductCodeAsc(Pageable pageable);

    @Query("select p from Product p where " +
            "p.productName like concat('%',:query, '%')" +
            "or p.productCode like concat('%',:query, '%')" +
            "or p.productCategoryCode like concat('%',:query, '%')" +
            "or p.productDescription like concat('%', :query, '%')")
    Page<Product> search(@Param("query") String query, Pageable pageable);

}
