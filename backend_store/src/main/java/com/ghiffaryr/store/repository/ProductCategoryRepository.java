package com.ghiffaryr.store.repository;

import com.ghiffaryr.store.entity.ProductCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
    Page<ProductCategory> findAllByOrderByProductCategoryCodeAsc(Pageable pageable);

    ProductCategory findByProductCategoryCode(String productCategoryCode);

}