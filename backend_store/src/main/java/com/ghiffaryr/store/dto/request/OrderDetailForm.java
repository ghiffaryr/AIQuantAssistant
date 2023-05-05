package com.ghiffaryr.store.dto.request;

import lombok.Data;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

@Data
public class OrderDetailForm {

    @NotBlank(message = "Product code must not be blank")
    private String productCode;

    @Min(message = "Product quantity must be greater than or equal to 1",
            value = 1)
    private Integer quantity;

}
