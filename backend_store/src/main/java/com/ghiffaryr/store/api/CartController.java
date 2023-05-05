package com.ghiffaryr.store.api;

import com.ghiffaryr.store.entity.Cart;
import com.ghiffaryr.store.entity.OrderDetail;
import com.ghiffaryr.store.service.CartService;
import com.ghiffaryr.store.dto.request.OrderDetailForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.security.Principal;
import java.util.Collection;

@CrossOrigin
@RestController
public class CartController {
    @Autowired
    CartService cartService;

    @PostMapping("/cart")
    public ResponseEntity<Cart> mergeLocal(@RequestBody @Valid Collection<OrderDetailForm> orderDetailForms, Principal principal) {
            return ResponseEntity.ok(cartService.mergeLocal(orderDetailForms, principal.getName()));
    }

    @PostMapping("/cart/add")
    public ResponseEntity<Cart> add(@RequestBody @Valid OrderDetailForm orderDetailForm, Principal principal) {
        return ResponseEntity.ok(cartService.add(orderDetailForm, principal.getName()));
    }

    @GetMapping("/cart")
    public ResponseEntity<Cart> get(Principal principal) {
        return ResponseEntity.ok(cartService.get(principal.getName()));
    }

    @PutMapping("/cart/{productCode}/update")
    public ResponseEntity<OrderDetail> update(@PathVariable("productCode") String productCode,
                                              @RequestBody @Valid Integer quantity,
                                              Principal principal) {
        return ResponseEntity.ok(cartService.update(productCode, quantity, principal.getName()));
    }

    @DeleteMapping("/cart/{productCode}/delete")
    public ResponseEntity<?> delete(@PathVariable("productCode") String productCode,
                                    Principal principal) {
        cartService.delete(productCode, principal.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/cart/checkout")
    public ResponseEntity<?> checkout(Principal principal) {
        cartService.checkout(principal.getName());
        return ResponseEntity.ok().build();
    }
}
