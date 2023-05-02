package com.ghiffaryr.store.service.impl;

import com.ghiffaryr.store.entity.*;
import com.ghiffaryr.store.enums.OrderStatusEnum;
import com.ghiffaryr.store.enums.ResultEnum;
import com.ghiffaryr.store.exception.BadRequestException;
import com.ghiffaryr.store.exception.ForbiddenException;
import com.ghiffaryr.store.exception.NotFoundException;
import com.ghiffaryr.store.repository.*;
import com.ghiffaryr.store.service.OrderMainService;
import com.ghiffaryr.store.service.ProductService;
import com.ghiffaryr.store.service.SubscriptionService;
import com.ghiffaryr.store.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class OrderMainServiceImpl implements OrderMainService {
    @Autowired
    OrderMainRepository orderMainRepository;
    @Autowired
    UserService userService;
    @Autowired
    SubscriptionRepository subscriptionRepository;
    @Autowired
    ProductService productService;

    @Override
    public Page<OrderMain> findAll(String authenticationEmail, Boolean isCustomer, Pageable pageable) {
        Page<OrderMain> orderMainPage;
        if (isCustomer) {
            orderMainPage = orderMainRepository.findAllByUserEmailOrderByOrderStatusAscCreateTimeDesc(authenticationEmail, pageable);
        } else {
            orderMainPage  = orderMainRepository.findAllByOrderByOrderStatusAscCreateTimeDesc(pageable);
        }
        if (orderMainPage.getTotalElements() == 0){
            throw new NotFoundException(ResultEnum.ORDER_NOT_FOUND);
        }
        return orderMainPage;
    }

    @Override
    public Page<OrderMain> findAllByStatus(Integer orderStatus, String authenticationEmail, Boolean isCustomer, Pageable pageable) {
        Page<OrderMain> orderMainPage;
        if (isCustomer) {
            orderMainPage = orderMainRepository.findAllByUserEmailAndOrderStatusOrderByCreateTimeDesc(authenticationEmail, orderStatus, pageable);
        } else {
            orderMainPage  = orderMainRepository.findAllByOrderStatusOrderByCreateTimeDesc(orderStatus, pageable);
        }
        if (orderMainPage.getTotalElements() == 0){
            throw new NotFoundException(ResultEnum.ORDER_NOT_FOUND);
        }
        return orderMainPage;
    }

    @Override
    public OrderMain find(Long orderId, String authenticationEmail, Boolean isCustomer) {
        OrderMain orderMain = orderMainRepository.findByOrderId(orderId);
        if (orderMain == null) {
            throw new NotFoundException(ResultEnum.ORDER_NOT_FOUND);
        }
        if (isCustomer && !authenticationEmail.equals(orderMain.getUserEmail())) {
            throw new ForbiddenException(ResultEnum.USER_NO_ACCESS);
        }
        return orderMain;
    }

    @Override
    @Transactional
    public OrderMain finish(Long orderId) {
        OrderMain orderMain = orderMainRepository.findByOrderId(orderId);
        if(orderMain == null) {
            throw new NotFoundException(ResultEnum.ORDER_NOT_FOUND);
        }
        orderMain.setOrderStatus(OrderStatusEnum.FINISHED.getCode());
        orderMainRepository.save(orderMain);
        // Add subscription
        User user = userService.find(orderMain.getUserEmail());
        orderMain.getOrderDetails().forEach(orderDetail -> {
            Product product = productService.find(orderDetail.getProductCode());
            Subscription subscription = subscriptionRepository.findByUserEmailAndProductCategoryCode(user.getEmail(), product.getProductCategoryCode());
            if (subscription == null){
                subscription = new Subscription();
                subscription.setProductCategoryCode(product.getProductCategoryCode());
                subscription.setUserEmail(user.getEmail());
                subscription.setExpTime(LocalDateTime.now().plusMonths(Long.valueOf(product.getProductPeriod()) * Long.valueOf(orderDetail.getQuantity())));
                subscriptionRepository.save(subscription);
            } else {
                LocalDateTime oldExpTime = subscription.getExpTime();
                if (oldExpTime.isBefore(LocalDateTime.now())) {
                    subscription.setExpTime(LocalDateTime.now().plusMonths(Long.valueOf(product.getProductPeriod()) * Long.valueOf(orderDetail.getQuantity())));
                } else {
                    subscription.setExpTime(oldExpTime.plusMonths(Long.valueOf(product.getProductPeriod()) * Long.valueOf(orderDetail.getQuantity())));
                }
                subscriptionRepository.save(subscription);
            }
        });
        return orderMain;
    }

    @Override
    @Transactional
    public OrderMain cancel(Long orderId, String authenticationEmail, Boolean isCustomer) {
        OrderMain orderMain = find(orderId, authenticationEmail, isCustomer);
        if (!orderMain.getOrderStatus().equals(OrderStatusEnum.NEW.getCode())) {
            throw new BadRequestException(ResultEnum.ORDER_STATUS_INVALID);
        }
        orderMain.setOrderStatus(OrderStatusEnum.CANCELED.getCode());
        return orderMainRepository.save(orderMain);

    }
}
