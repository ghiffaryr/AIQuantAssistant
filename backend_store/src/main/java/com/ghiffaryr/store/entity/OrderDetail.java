package com.ghiffaryr.store.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long orderDetailId;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "cart_id")
    @JsonIgnore
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private OrderMain orderMain;

    @NotBlank(message = "Product code must not be blank")
    private String productCode;

    @Min(message = "Product price must be greater than or equal to 0",
            value = 0)
    private BigDecimal productPrice;

    @Min(message = "Product quantity must be greater than or equal to 1",
            value = 1)
    private Integer quantity;

    public OrderDetail(Product product, Integer quantity) {
        this.productCode = product.getProductCode();
        this.productPrice = product.getProductPrice();
        this.quantity = quantity;
    }
}
