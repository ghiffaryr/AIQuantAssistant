package com.ghiffaryr.store.dto.request;

import lombok.Data;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;

@Data
public class ProductForm {

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
    private Integer productStatus = 0;

    @NotBlank(message = "Product category code must not be blank")
    private String productCategoryCode;

}
