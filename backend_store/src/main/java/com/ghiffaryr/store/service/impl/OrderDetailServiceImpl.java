package com.ghiffaryr.store.service.impl;

import com.ghiffaryr.store.entity.OrderDetail;
import com.ghiffaryr.store.entity.User;
import com.ghiffaryr.store.enums.ResultEnum;
import com.ghiffaryr.store.exception.NotFoundException;
import com.ghiffaryr.store.repository.OrderDetailRepository;
import com.ghiffaryr.store.service.OrderDetailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderDetailServiceImpl implements OrderDetailService {
    private static final Logger logger = LoggerFactory.getLogger(OrderDetailServiceImpl.class);

    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Override
    @Transactional
    public OrderDetail update(String productCode, Integer quantity, User user) {
        OrderDetail oldOrderDetail = user.getCart().getOrderDetails().stream().filter(e -> productCode.equals(e.getProductCode())).findFirst().orElse(null);
        if (oldOrderDetail == null) {
            logger.error(ResultEnum.CART_IS_EMPTY.getMessage());
            throw new NotFoundException(ResultEnum.ORDER_DETAIL_NOT_FOUND);
        }
        oldOrderDetail.setQuantity(quantity);
        return orderDetailRepository.save(oldOrderDetail);
    }

    @Override
    public OrderDetail find(String productCode, User user) {
        OrderDetail orderDetail = user.getCart().getOrderDetails().stream().filter(e -> productCode.equals(e.getProductCode())).findFirst().orElse(null);
        if (orderDetail == null) {
            logger.error(ResultEnum.ORDER_DETAIL_NOT_FOUND.getMessage());
            throw new NotFoundException(ResultEnum.ORDER_DETAIL_NOT_FOUND);
        }
        return orderDetail;
    }
}
