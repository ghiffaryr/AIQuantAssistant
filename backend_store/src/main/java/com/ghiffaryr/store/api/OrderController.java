package com.ghiffaryr.store.api;

import com.ghiffaryr.store.entity.OrderMain;
import com.ghiffaryr.store.enums.OrderStatusEnum;
import com.ghiffaryr.store.service.OrderMainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class OrderController {
    @Autowired
    OrderMainService orderMainService;

    @GetMapping("/order")
    public ResponseEntity<Page<OrderMain>> getPage(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                     @RequestParam(value = "size", defaultValue = "10") Integer size,
                                     Authentication authentication) {
        PageRequest request = PageRequest.of(page - 1, size);
        Page<OrderMain> orderPage = orderMainService.findAll(authentication.getName(),
                authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CUSTOMER")),
                request);
        return ResponseEntity.ok(orderPage);
    }

    @GetMapping("/order/new")
    public ResponseEntity<Page<OrderMain>> getNewPage(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                                   @RequestParam(value = "size", defaultValue = "10") Integer size,
                                                   Authentication authentication) {
        PageRequest request = PageRequest.of(page - 1, size);
        Page<OrderMain> orderPage = orderMainService.findAllByStatus(OrderStatusEnum.NEW.getCode(),
                authentication.getName(),
                authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CUSTOMER")),
                request);
        return ResponseEntity.ok(orderPage);
    }

    @GetMapping("/order/finished")
    public ResponseEntity<Page<OrderMain>> getFinishedPage(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                                      @RequestParam(value = "size", defaultValue = "10") Integer size,
                                                      Authentication authentication) {
        PageRequest request = PageRequest.of(page - 1, size);
        Page<OrderMain> orderPage = orderMainService.findAllByStatus(OrderStatusEnum.FINISHED.getCode(),
                authentication.getName(),
                authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CUSTOMER")),
                request);
        return ResponseEntity.ok(orderPage);
    }

    @GetMapping("/order/canceled")
    public ResponseEntity<Page<OrderMain>> getCanceledPage(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                                           @RequestParam(value = "size", defaultValue = "10") Integer size,
                                                           Authentication authentication) {
        PageRequest request = PageRequest.of(page - 1, size);
        Page<OrderMain> orderPage = orderMainService.findAllByStatus(OrderStatusEnum.CANCELED.getCode(),
                authentication.getName(),
                authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CUSTOMER")),
                request);
        return ResponseEntity.ok(orderPage);
    }

    @PatchMapping("/order/cancel/{orderId}")
    public ResponseEntity<OrderMain> cancel(@PathVariable("orderId") Long orderId, Authentication authentication) {
        return ResponseEntity.ok(orderMainService.cancel(orderId,
                authentication.getName(),
                authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CUSTOMER"))));
    }

    @PatchMapping("/order/finish/{orderId}")
    public ResponseEntity<OrderMain> finish(@PathVariable("orderId") Long orderId) {
        return ResponseEntity.ok(orderMainService.finish(orderId));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<OrderMain> get(@PathVariable("orderId") Long orderId, Authentication authentication) {
        return ResponseEntity.ok(orderMainService.find(orderId,
                authentication.getName(),
                authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CUSTOMER"))));
    }
}
