package com.ghiffaryr.store.service.impl;

import com.ghiffaryr.store.dto.request.OrderDetailForm;
import com.ghiffaryr.store.entity.*;
import com.ghiffaryr.store.enums.ProductStatusEnum;
import com.ghiffaryr.store.enums.ResultEnum;
import com.ghiffaryr.store.exception.BadRequestException;
import com.ghiffaryr.store.exception.InternalServerErrorException;
import com.ghiffaryr.store.exception.NotFoundException;
import com.ghiffaryr.store.repository.*;
import com.ghiffaryr.store.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Collection;
import java.util.Collections;
import java.util.Set;

@Service
public class CartServiceImpl implements CartService {
    @Autowired
    OrderMainRepository orderMainRepository;
    @Autowired
    OrderDetailRepository orderDetailRepository;
    @Autowired
    CartRepository cartRepository;
    @Autowired
    UserService userService;
    @Autowired
    OrderDetailService orderDetailService;
    @Autowired
    ProductService productService;

    @Override
    public Cart get(String principalName) {;
        User user = userService.find(principalName);
        Cart cart = user.getCart();
        if (cart == null){
            cart = new Cart(user);
            cartRepository.save(cart);
        }
        return cart;
    }

    @Override
    @Transactional
    public Cart mergeLocal(Collection<OrderDetailForm> orderDetailForms, String principalName) {
        Cart finalCart = get(principalName);
        try {
            orderDetailForms.forEach(OrderDetailForm -> {
                Set<OrderDetail> orderDetailsInFinalCart = finalCart.getOrderDetails();
                var currentOrderDetail = orderDetailsInFinalCart.stream().filter(orderDetailInFinalCart -> orderDetailInFinalCart.getProductCode().equals(OrderDetailForm.getProductCode())).findFirst();
                OrderDetail newOrderDetail;
                if (currentOrderDetail.isPresent()) {
                    newOrderDetail = currentOrderDetail.get();
                    newOrderDetail.setQuantity(OrderDetailForm.getQuantity() + newOrderDetail.getQuantity());
                } else {
                    Product product = productService.find(OrderDetailForm.getProductCode());
                    newOrderDetail = new OrderDetail();
                    newOrderDetail.setProductCode(product.getProductCode());
                    newOrderDetail.setProductPrice(product.getProductPrice());
                    newOrderDetail.setQuantity(OrderDetailForm.getQuantity());
                    newOrderDetail.setCart(finalCart);
                    finalCart.getOrderDetails().add(newOrderDetail);
                }
                orderDetailRepository.save(newOrderDetail);
            });
            return cartRepository.save(finalCart);
        } catch (Exception e) {
            throw new InternalServerErrorException(ResultEnum.CART_MERGE_FAILED);
        }
    }

    @Override
    @Transactional
    public Cart add(OrderDetailForm orderDetailForm, String principalName){
        Product product = productService.find(orderDetailForm.getProductCode());
        return mergeLocal(Collections.singleton(orderDetailForm), principalName);
    }

    @Override
    @Transactional
    public OrderDetail update(String productCode, Integer quantity, String principalName){
        User user = get(principalName).getUser();
        return orderDetailService.update(productCode, quantity, user);
    }

    @Override
    @Transactional
    public void delete(String productCode, String principalName) {
        Cart cart = get(principalName);
        if (cart.getOrderDetails().isEmpty()) {
            throw new BadRequestException(ResultEnum.CART_IS_EMPTY);
        }
        OrderDetail orderDetail = cart.getOrderDetails().stream().filter(orderDetailInFinalCart -> productCode.equals(orderDetailInFinalCart.getProductCode())).findFirst().orElse(null);
        if (orderDetail == null) {
            throw new NotFoundException(ResultEnum.ORDER_DETAIL_NOT_FOUND);
        }
        orderDetail.setCart(null);
        orderDetailRepository.deleteById(orderDetail.getOrderDetailId());
    }

    @Override
    @Transactional
    public void checkout(String principalName) {
        Cart cart = get(principalName);
        if (cart.getOrderDetails().isEmpty()) {
            throw new BadRequestException(ResultEnum.CART_IS_EMPTY);
        }
        User user = cart.getUser();
        OrderMain orderMain = new OrderMain(user);
        orderMainRepository.save(orderMain);
        cart.getOrderDetails().forEach(orderDetailInFinalCart -> {
            Product product = productService.find(orderDetailInFinalCart.getProductCode());
            if (product.getProductStatus().equals(ProductStatusEnum.ONSALE.getCode())){
                orderDetailInFinalCart.setCart(null);
                orderDetailInFinalCart.setOrderMain(orderMain);
                orderDetailRepository.save(orderDetailInFinalCart);
            }
        });
    }
}
