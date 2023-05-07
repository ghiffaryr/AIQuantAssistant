package com.ghiffaryr.store.repository;

import com.ghiffaryr.store.entity.OrderMain;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderMainRepository extends JpaRepository<OrderMain, Integer> {

    OrderMain findByOrderId(Long orderId);

    Page<OrderMain> findAllByUserEmailOrderByCreateTimeDesc(String userEmail, Pageable pageable);

    Page<OrderMain> findAllByOrderByCreateTimeDesc(Pageable pageable);

    Page<OrderMain> findAllByOrderStatusOrderByCreateTimeDesc(Integer orderStatus, Pageable pageable);

    Page<OrderMain> findAllByUserEmailAndOrderStatusOrderByCreateTimeDesc(String userEmail, Integer orderStatus, Pageable pageable);

}