package com.ghiffaryr.store.api;

import com.ghiffaryr.store.entity.Product;
import com.ghiffaryr.store.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class SearchController {

    @Autowired
    ProductService productService;

    @GetMapping("/search")
    public ResponseEntity<Page<Product>> product(@RequestParam("query") String query,
                                                 @RequestParam(value = "page", defaultValue = "1") Integer page,
                                                 @RequestParam(value = "size", defaultValue = "3") Integer size) {
        PageRequest request = PageRequest.of(page - 1, size);
        return ResponseEntity.ok(productService.search(query, request));
    }
}
