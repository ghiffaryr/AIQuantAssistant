package com.ghiffaryr.store.repository;

import com.ghiffaryr.store.entity.Subscription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Subscription findBySubscriptionId(Long id);

    Subscription findByUserEmailAndProductCategoryCode(String userEmail, String productCategoryCode);

    Page<Subscription> findAllByUserEmailOrderByExpTimeDesc(String userEmail, Pageable pageable);

    @Query("select s from Subscription s where s.expTime > current_date order by s.expTime desc")
    Page<Subscription> findActiveAllByOrderByExpTimeDesc(Pageable pageable);

    @Query("select s from Subscription s where s.expTime > current_date and s.userEmail=:userEmail order by s.expTime desc")
    Page<Subscription> findActiveAllByUserEmailOrderByExpTimeDesc(@Param("userEmail") String userEmail, Pageable pageable);

}
