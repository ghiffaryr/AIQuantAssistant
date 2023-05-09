package com.ghiffaryr.store.api;

import com.ghiffaryr.store.entity.Product;
import com.ghiffaryr.store.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

@CrossOrigin
@RestController
public class SearchController {

    @Autowired
    ProductService productService;

    @GetMapping("/search")
    public ResponseEntity<Page<Product>> product(@RequestParam("query") String query,
                                                 @RequestParam(value = "productStatus", required=false)
                                                     @Min(message = "Product status must be greater than or equal to 0", value = 0)
                                                     @Max(message = "Product status must be less than or equal to 1", value = 1)
                                                     Integer productStatus,
                                                 @RequestParam(value = "page", defaultValue = "1") Integer page,
                                                 @RequestParam(value = "size", defaultValue = "3") Integer size) {
        PageRequest request = PageRequest.of(page - 1, size);
        if (productStatus != null){
            return ResponseEntity.ok(productService.searchByProductStatus(productStatus, query, request));
        }
        return ResponseEntity.ok(productService.search(query, request));
    }
}
