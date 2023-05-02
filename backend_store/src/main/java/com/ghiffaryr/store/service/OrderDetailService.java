package com.ghiffaryr.store.service;

import com.ghiffaryr.store.entity.OrderDetail;
import com.ghiffaryr.store.entity.User;

public interface OrderDetailService {

    OrderDetail update(String productCode, Integer quantity, User user);

    OrderDetail find(String productCode, User user);

}
