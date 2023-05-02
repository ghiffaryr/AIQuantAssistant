package com.ghiffaryr.store.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@DynamicUpdate
public class ProductCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long productCategoryId;

    @NotBlank(message = "Product category code must not be blank")
    private String productCategoryCode;

    @NotBlank(message = "Product category name must not be blank")
    private String productCategoryName;

    private String productCategoryDescription;

    private String productCategoryImage;

    @CreationTimestamp
    private LocalDateTime createTime;

    @UpdateTimestamp
    private LocalDateTime updateTime;

    public ProductCategory(String productCategoryCode,
                           String productCategoryName,
                           String productCategoryImage,
                           String productCategoryDescription) {
        this.productCategoryCode = productCategoryCode;
        this.productCategoryName = productCategoryName;
        this.productCategoryImage = productCategoryImage;
        this.productCategoryDescription = productCategoryDescription;
    }
}
