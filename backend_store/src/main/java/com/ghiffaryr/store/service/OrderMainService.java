package com.ghiffaryr.store.service;

import com.ghiffaryr.store.entity.OrderMain;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderMainService {

    Page<OrderMain> findAll(String authenticationEmail, Boolean isCustomer, Pageable pageable);

    Page<OrderMain> findAllByStatus(Integer orderStatus, String authenticationEmail, Boolean isCustomer, Pageable pageable);

    OrderMain find(Long orderId, String authenticationEmail, Boolean isCustomer);

    OrderMain finish(Long orderId);

    OrderMain cancel(Long orderId, String authenticationEmail, Boolean isCustomer);

}
