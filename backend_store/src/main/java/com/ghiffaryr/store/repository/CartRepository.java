package com.ghiffaryr.store.repository;

import com.ghiffaryr.store.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {

}