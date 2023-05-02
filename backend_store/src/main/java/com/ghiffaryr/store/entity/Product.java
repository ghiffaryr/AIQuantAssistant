package com.ghiffaryr.store.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;
import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@DynamicUpdate
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long productId;

    @NotBlank(message = "Product code must not be blank")
    private String productCode;

    @NotBlank(message = "Product name must not be blank")
    private String productName;

    @Min(message = "Product price must be greater than or equal to 0",
            value = 0)
    private BigDecimal productPrice;

    @Min(message = "Product period must be greater than or equal to 0",
            value = 0)
    private Integer productPeriod;

    private String productDescription;

    private String productImage;

    @Min(message = "Product status must be greater than or equal to 0",
            value = 0)
    @Max(message = "Product status must be less than or equal to 1",
            value = 1)
    private Integer productStatus = 1;

    @NotBlank(message = "Product category code must not be blank")
    private String productCategoryCode;

    @CreationTimestamp
    private LocalDateTime createTime;

    @UpdateTimestamp
    private LocalDateTime updateTime;

    Product(String productCode,
            String productName,
            BigDecimal productPrice,
            Integer productPeriod,
            String productDescription,
            String productImage,
            Integer productStatus,
            String productCategoryCode){
        this.productCode = productCode;
        this.productName = productName;
        this.productPrice = productPrice;
        this.productPeriod = productPeriod;
        this.productDescription = productDescription;
        this.productImage = productImage;
        this.productStatus = productStatus;
        this.productCategoryCode = productCategoryCode;
    }

}
