package com.ghiffaryr.store.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;
import javax.persistence.*;
import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@DynamicUpdate
public class OrderMain {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long orderId;

    @OneToMany(mappedBy = "orderMain", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<OrderDetail> orderDetails = new HashSet<>();

    @Email(regexp = "([a-zA-Z0-9]+(?:[._+-][a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*[.][a-zA-Z]{2,})",
            message = "Invalid user email address")
    private String userEmail;

    @Min(message = "Order amount must be greater than or equal to 0",
            value = 0)
    private BigDecimal orderAmount;

    @Min(message = "Order amount must be greater than or equal to 0",
            value = 0)
    @Max(message = "Order amount must be less than or equal to 1",
            value = 2)
    private Integer orderStatus = 0;

    @CreationTimestamp
    private LocalDateTime createTime;

    @UpdateTimestamp
    private LocalDateTime updateTime;

    public OrderMain(User user) {
        this.userEmail = user.getEmail();
        this.orderAmount = user.getCart().getOrderDetails().stream()
                .map(item -> item.getProductPrice()
                        .multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal::add).orElse(new BigDecimal(0));
        this.orderStatus = 0;
    }
}
