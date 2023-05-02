package com.ghiffaryr.store.api;

import com.ghiffaryr.store.entity.Product;
import com.ghiffaryr.store.enums.ProductStatusEnum;
import com.ghiffaryr.store.service.ProductService;
import com.ghiffaryr.store.dto.request.ProductForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@CrossOrigin
@RestController
public class ProductController {
    @Autowired
    ProductService productService;

    @GetMapping("/product")
    public ResponseEntity<Page<Product>> getPage(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                 @RequestParam(value = "size", defaultValue = "3") Integer size) {
        PageRequest request = PageRequest.of(page - 1, size);
        return ResponseEntity.ok(productService.findAll(request));
    }

    @GetMapping("/product/onsale")
    public ResponseEntity<Page<Product>> getOnSalePage(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                                     @RequestParam(value = "size", defaultValue = "3") Integer size) {
        PageRequest request = PageRequest.of(page - 1, size);
        return ResponseEntity.ok(productService.findAllByProductStatus(ProductStatusEnum.ONSALE.getCode(), request));
    }

    @GetMapping("/product/offsale")
    public ResponseEntity<Page<Product>> getOffSalePage(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                                       @RequestParam(value = "size", defaultValue = "3") Integer size) {
        PageRequest request = PageRequest.of(page - 1, size);
        return ResponseEntity.ok(productService.findAllByProductStatus(ProductStatusEnum.OFFSALE.getCode(), request));
    }

    @GetMapping("/product/{productCode}")
    public ResponseEntity<Product> get(@PathVariable("productCode") String productCode) {
        return ResponseEntity.ok(productService.find(productCode));
    }

    @PostMapping("/seller/product/create")
    public ResponseEntity<Product> create(@RequestBody @Valid ProductForm productForm) {
        return ResponseEntity.ok(productService.create(productForm));
    }

    @PutMapping("/seller/product/{productCode}/update")
    public ResponseEntity<Product> update(@PathVariable("productCode") String productCode,
                                  @RequestBody @Valid ProductForm productForm) {
        return ResponseEntity.ok(productService.update(productCode, productForm));
    }

    @PatchMapping("/seller/product/{productCode}/onsale")
    public ResponseEntity<Product> onSale(@PathVariable("productCode") String productCode) {
        return ResponseEntity.ok(productService.onSale(productCode));
    }

    @PatchMapping("/seller/product/{productCode}/offsale")
    public ResponseEntity<Product> offSale(@PathVariable("productCode") String productCode) {
        return ResponseEntity.ok(productService.offSale(productCode));
    }

    @DeleteMapping("/seller/product/{productCode}/delete")
    public ResponseEntity<?> delete(@PathVariable("productCode") String productCode) {
        productService.delete(productCode);
        return ResponseEntity.ok().build();
    }
}
