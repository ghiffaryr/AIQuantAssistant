package com.ghiffaryr.store.service.impl;

import com.ghiffaryr.store.entity.Subscription;
import com.ghiffaryr.store.enums.ResultEnum;
import com.ghiffaryr.store.exception.ForbiddenException;
import com.ghiffaryr.store.exception.NotFoundException;
import com.ghiffaryr.store.repository.SubscriptionRepository;
import com.ghiffaryr.store.service.SubscriptionService;
import com.ghiffaryr.store.dto.request.SubscriptionUpdateForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    @Autowired
    SubscriptionRepository subscriptionRepository;

    @Override
    public Subscription find(Long subscriptionId, String authenticationEmail, Boolean isCustomer) {
        Subscription subscription = subscriptionRepository.findBySubscriptionId(subscriptionId);
        if (subscription == null) {
            throw new NotFoundException(ResultEnum.SUBSCRIPTION_NOT_FOUND);
        }
        if (isCustomer && !authenticationEmail.equals(subscription.getUserEmail())) {
            throw new ForbiddenException(ResultEnum.USER_NO_ACCESS);
        }
        return subscription;
    }

    @Override
    public Subscription findByUserEmailAndProductCategoryCode(String userEmail, String productCategoryCode, Boolean isCustomer) {
        Subscription subscription = subscriptionRepository.findByUserEmailAndProductCategoryCode(userEmail, productCategoryCode);
        if (subscription == null) {
            throw new NotFoundException(ResultEnum.SUBSCRIPTION_NOT_FOUND);
        }
        if (isCustomer && !userEmail.equals(subscription.getUserEmail())) {
            throw new ForbiddenException(ResultEnum.USER_NO_ACCESS);
        }
        return subscription;
    }

    @Override
    public Page<Subscription> findAll(String authenticationEmail, Boolean isCustomer, Pageable pageable) {
        Page<Subscription> subscriptionPage;
        if (isCustomer) {
            subscriptionPage = subscriptionRepository.findAllByUserEmailOrderByExpTimeDesc(authenticationEmail, pageable);
        } else {
            subscriptionPage  = subscriptionRepository.findAll(pageable);
        }
        if (subscriptionPage.getTotalElements() == 0){
            throw new NotFoundException(ResultEnum.SUBSCRIPTION_NOT_FOUND);
        }
        return subscriptionPage;

    }

    @Override
    public Page<Subscription> findActiveAll(String authenticationEmail, Boolean isCustomer, Pageable pageable) {
        Page<Subscription> subscriptionPage;
        if (isCustomer) {
            subscriptionPage = subscriptionRepository.findActiveAllByUserEmailOrderByExpTimeDesc(authenticationEmail, pageable);
        } else {
            subscriptionPage  = subscriptionRepository.findActiveAllByOrderByExpTimeDesc(pageable);
        }
        if (subscriptionPage.getTotalElements() == 0){
            throw new NotFoundException(ResultEnum.SUBSCRIPTION_NOT_FOUND);
        }
        return subscriptionPage;

    }

    @Override
    @Transactional
    public Subscription update(Long subscriptionId, SubscriptionUpdateForm subscriptionUpdateForm) {
        Subscription oldSubscription = subscriptionRepository.findBySubscriptionId(subscriptionId);
        if(oldSubscription == null) {
            throw new NotFoundException(ResultEnum.SUBSCRIPTION_NOT_FOUND);
        }
        oldSubscription.setProductCategoryCode(subscriptionUpdateForm.getProductCategoryCode());
        oldSubscription.setExpTime(subscriptionUpdateForm.getExpTime());
        return subscriptionRepository.save(oldSubscription);
    }

    @Override
    public void delete(Long subscriptionId) {
        Subscription subscription = find(subscriptionId, null, false);
        subscriptionRepository.delete(subscription);
    }
}
