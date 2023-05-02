package com.ghiffaryr.store.service;

import com.ghiffaryr.store.dto.request.ForecastForm;
import com.ghiffaryr.store.entity.ProductCategory;
import com.ghiffaryr.store.dto.request.ProductCategoryForm;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductCategoryService {

    ProductCategory find(String categoryCode);

    Page<ProductCategory> findAll(Pageable pageable);

    ProductCategory update(String categoryCode, ProductCategoryForm productCategoryForm);

    ProductCategory create(ProductCategoryForm productCategoryForm);

    void delete(String productCategoryCode);

    String predict(String modelApi, String productCategoryCode, ForecastForm forecastForm, String authenticationEmail, Boolean isCustomer);

}
