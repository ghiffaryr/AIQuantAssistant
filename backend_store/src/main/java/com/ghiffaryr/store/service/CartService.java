package com.ghiffaryr.store.service;

import com.ghiffaryr.store.dto.request.OrderDetailForm;
import com.ghiffaryr.store.entity.Cart;
import com.ghiffaryr.store.entity.OrderDetail;
import java.util.Collection;

public interface CartService {

    Cart get(String principalName);

    Cart mergeLocal(Collection<OrderDetailForm> orderDetailForms, String principalName);

    Cart add(OrderDetailForm orderDetailForm, String principalName);

    OrderDetail update(String productCode, Integer quantity, String principalName);

    void delete(String productCode, String principalName);

    void checkout(String principalName);

}
