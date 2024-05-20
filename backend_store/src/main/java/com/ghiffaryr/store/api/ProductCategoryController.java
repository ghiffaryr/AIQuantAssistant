package com.ghiffaryr.store.api;

import com.ghiffaryr.store.dto.request.PredictForm;
import com.ghiffaryr.store.entity.ProductCategory;
import com.ghiffaryr.store.entity.Product;
import com.ghiffaryr.store.enums.ProductStatusEnum;
import com.ghiffaryr.store.service.ProductCategoryService;
import com.ghiffaryr.store.service.ProductService;
import com.ghiffaryr.store.dto.request.ProductCategoryForm;
import com.ghiffaryr.store.dto.response.ProductCategoryPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@CrossOrigin
public class ProductCategoryController {
    @Autowired
    ProductCategoryService productCategoryService;
    @Autowired
    ProductService productService;
    @Value("${forecast.predict.api}")
    private String forecastApi;
    @Value("${sentiment.predict.api}")
    private String sentimentApi;
    @Value("${topic.predict.api}")
    private String topicApi;
    @Value("${summary.predict.api}")
    private String summaryApi;

    @GetMapping("/category")
    public ResponseEntity<Page<ProductCategory>> getPage(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                                     @RequestParam(value = "size", defaultValue = "3") Integer size) {
        PageRequest request = PageRequest.of(page - 1, size);
        return ResponseEntity.ok(productCategoryService.findAll(request));
    }

    @GetMapping("/category/{productCategoryCode}")
    public ResponseEntity<ProductCategory> get(@PathVariable("productCategoryCode") String productCategoryCode) {
        return ResponseEntity.ok(productCategoryService.find(productCategoryCode));
    }

    @GetMapping("/category/{productCategoryCode}/product")
    public ResponseEntity<ProductCategoryPage> get(@PathVariable("productCategoryCode") String productCategoryCode,
                                       @RequestParam(value = "page", defaultValue = "1") Integer page,
                                       @RequestParam(value = "size", defaultValue = "3") Integer size) {
        PageRequest request = PageRequest.of(page - 1, size);
        Page<Product> productPage = productService.findAllByProductCategoryCode(productCategoryCode, request);
        ProductCategory productCategory = productCategoryService.find(productCategoryCode);
        return ResponseEntity.ok(ProductCategoryPage.builder()
                                                    .productCategoryName(productCategory.getProductCategoryName())
                                                    .productCategoryCode(productCategory.getProductCategoryCode())
                                                    .productCategoryDescription(productCategory.getProductCategoryDescription())
                                                    .productCategoryImage(productCategory.getProductCategoryImage())
                                                    .createTime(productCategory.getCreateTime())
                                                    .updateTime(productCategory.getUpdateTime())
                                                    .page(productPage)
                                                    .build());
    }

    @GetMapping("/category/{productCategoryCode}/product/onsale")
    public ResponseEntity<ProductCategoryPage> getOnSalePage(@PathVariable("productCategoryCode") String productCategoryCode,
                                                   @RequestParam(value = "page", defaultValue = "1") Integer page,
                                                   @RequestParam(value = "size", defaultValue = "3") Integer size) {
        PageRequest request = PageRequest.of(page - 1, size);
        Page<Product> productPage = productService.findAllByProductStatusAndProductCategoryCode(ProductStatusEnum.ONSALE.getCode(), productCategoryCode, request);
        ProductCategory productCategory = productCategoryService.find(productCategoryCode);
        return ResponseEntity.ok(ProductCategoryPage.builder()
                .productCategoryName(productCategory.getProductCategoryName())
                .productCategoryCode(productCategory.getProductCategoryCode())
                .productCategoryDescription(productCategory.getProductCategoryDescription())
                .productCategoryImage(productCategory.getProductCategoryImage())
                .createTime(productCategory.getCreateTime())
                .updateTime(productCategory.getUpdateTime())
                .page(productPage)
                .build());
    }

    @GetMapping("/category/{productCategoryCode}/product/offsale")
    public ResponseEntity<ProductCategoryPage> getOffSalePage(@PathVariable("productCategoryCode") String productCategoryCode,
                                                             @RequestParam(value = "page", defaultValue = "1") Integer page,
                                                             @RequestParam(value = "size", defaultValue = "3") Integer size) {
        PageRequest request = PageRequest.of(page - 1, size);
        Page<Product> productPage = productService.findAllByProductStatusAndProductCategoryCode(ProductStatusEnum.OFFSALE.getCode(), productCategoryCode, request);
        ProductCategory productCategory = productCategoryService.find(productCategoryCode);
        return ResponseEntity.ok(ProductCategoryPage.builder()
                .productCategoryName(productCategory.getProductCategoryName())
                .productCategoryCode(productCategory.getProductCategoryCode())
                .productCategoryDescription(productCategory.getProductCategoryDescription())
                .productCategoryImage(productCategory.getProductCategoryImage())
                .createTime(productCategory.getCreateTime())
                .updateTime(productCategory.getUpdateTime())
                .page(productPage)
                .build());
    }


    @PostMapping("/category/{productCategoryCode}/predict")
    public ResponseEntity<String> predict(@PathVariable("productCategoryCode") String productCategoryCode,
                          @RequestBody @Valid PredictForm predictForm,
                          Authentication authentication) {
        return ResponseEntity.ok(productCategoryService.predict(forecastApi, sentimentApi, topicApi, summaryApi,
                productCategoryCode,
                predictForm,
                authentication.getName(),
                authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CUSTOMER"))));
    }

    @PostMapping("/seller/category/create")
    public ResponseEntity<ProductCategory> create(@RequestBody @Valid ProductCategoryForm productCategoryForm) {
        return ResponseEntity.ok(productCategoryService.create(productCategoryForm));
    }

    @PutMapping("/seller/category/{productCategoryCode}/update")
    public ResponseEntity<ProductCategory> update(@PathVariable("productCategoryCode") String productCategoryCode,
                               @RequestBody @Valid ProductCategoryForm productCategoryForm) {
        return ResponseEntity.ok(productCategoryService.update(productCategoryCode, productCategoryForm));
    }

    @DeleteMapping("/seller/category/{productCategoryCode}/delete")
    public ResponseEntity<?> delete(@PathVariable("productCategoryCode") String productCategoryCode) {
        productCategoryService.delete(productCategoryCode);
        return ResponseEntity.ok().build();
    }
}
