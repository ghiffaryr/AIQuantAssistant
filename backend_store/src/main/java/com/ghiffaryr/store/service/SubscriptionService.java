package com.ghiffaryr.store.service;

import com.ghiffaryr.store.entity.Subscription;
import com.ghiffaryr.store.dto.request.SubscriptionUpdateForm;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SubscriptionService {

    Subscription find(Long subscriptionId, String authenticationEmail, Boolean isCustomer);

    Subscription findByUserEmailAndProductCategoryCode(String userEmail, String productCategoryCode, Boolean isCustomer);

    Page<Subscription> findActiveAll(String authenticationEmail, Boolean isCustomer, Pageable pageable);

    Page<Subscription> findAll(String authenticationEmail, Boolean isCustomer, Pageable pageable);

    Subscription update(Long subscriptionId, SubscriptionUpdateForm subscriptionUpdateForm);

    void delete(Long subscriptionId);

}
