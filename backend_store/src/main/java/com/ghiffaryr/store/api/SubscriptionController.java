package com.ghiffaryr.store.api;

import com.ghiffaryr.store.entity.*;
import com.ghiffaryr.store.service.SubscriptionService;
import com.ghiffaryr.store.dto.request.SubscriptionUpdateForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@CrossOrigin
@RestController
public class SubscriptionController {
    @Autowired
    SubscriptionService subscriptionService;

    @GetMapping("/subscription")
    public ResponseEntity<Page<Subscription>> getPage(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                      @RequestParam(value = "size", defaultValue = "3") Integer size,
                                      Authentication authentication) {
        PageRequest request = PageRequest.of(page - 1, size);
        Page<Subscription> subscriptionPage = subscriptionService.findAll(authentication.getName(),
                authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CUSTOMER")),
                                                                            request);
        return ResponseEntity.ok(subscriptionPage);
    }

    @GetMapping("/subscription/active")
    public ResponseEntity<Page<Subscription>> getActivePage(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                                      @RequestParam(value = "size", defaultValue = "3") Integer size,
                                                      Authentication authentication) {
        PageRequest request = PageRequest.of(page - 1, size);
        Page<Subscription> subscriptionPage = subscriptionService.findActiveAll(authentication.getName(),
                authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CUSTOMER")),
                request);
        return ResponseEntity.ok(subscriptionPage);
    }

    @GetMapping("/subscription/{subscriptionId}")
    public ResponseEntity<Subscription> get(@PathVariable("subscriptionId") Long subscriptionId,
                                  Authentication authentication) {
        return ResponseEntity.ok(subscriptionService.find(subscriptionId,
                authentication.getName(),
                authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CUSTOMER"))));
    }

    @PutMapping("/seller/subscription/{subscriptionId}/update")
    public ResponseEntity<Subscription> update(@PathVariable("subscriptionId") Long subscriptionId,
                               @RequestBody @Valid SubscriptionUpdateForm subscriptionUpdateForm) {
        return ResponseEntity.ok(subscriptionService.update(subscriptionId,
                subscriptionUpdateForm));
    }

    @DeleteMapping("/seller/subscription/{subscriptionId}/delete")
    public ResponseEntity<?> delete(@PathVariable("subscriptionId") Long subscriptionId) {
        subscriptionService.delete(subscriptionId);
        return ResponseEntity.ok().build();
    }
}