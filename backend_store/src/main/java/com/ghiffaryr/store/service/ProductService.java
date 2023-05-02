package com.ghiffaryr.store.service;

import com.ghiffaryr.store.entity.Product;
import com.ghiffaryr.store.dto.request.ProductForm;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {

    Product find(String productCode);

    Page<Product> findAll(Pageable pageable);

    Page<Product> findAllByProductStatus(Integer productStatus, Pageable pageable);

    Page<Product> findAllByProductCategoryCode(String productCategoryCode, Pageable pageable);

    Page<Product> findAllByProductStatusAndProductCategoryCode(Integer productStatus, String productCategoryCode, Pageable pageable);

    Page<Product> search(String query, Pageable pageable);

    Product offSale(String productCode);

    Product onSale(String productCode);

    Product update(String productCode, ProductForm productForm);

    Product create(ProductForm productForm);

    void delete(String productCode);

}
