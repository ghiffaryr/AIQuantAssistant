package com.ghiffaryr.store.dto.request;

import lombok.Data;
import javax.validation.constraints.NotBlank;

@Data
public class ProductCategoryForm {

    @NotBlank(message = "Product category name must not be blank")
    private String productCategoryName;

    @NotBlank(message = "Product category code must not be blank")
    private String productCategoryCode;

    private String productCategoryDescription;

    private String productCategoryImage;
    
}
