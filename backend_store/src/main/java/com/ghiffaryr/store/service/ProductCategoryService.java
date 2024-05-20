package com.ghiffaryr.store.service;

import com.ghiffaryr.store.dto.request.PredictForm;
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

    String predict(String forecastApi, String sentimentApi, String topicApi, String summaryApi, String productCategoryCode, PredictForm predictForm, String authenticationEmail, Boolean isCustomer);

}
