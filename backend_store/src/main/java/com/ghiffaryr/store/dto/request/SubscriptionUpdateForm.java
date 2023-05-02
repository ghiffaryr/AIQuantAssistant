package com.ghiffaryr.store.dto.request;

import lombok.Data;

import javax.validation.constraints.FutureOrPresent;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
public class SubscriptionUpdateForm {

    @NotBlank(message = "Product category code must not be blank")
    String productCategoryCode;

    @FutureOrPresent(message = "Expiration time must be a date in the present or in the future")
    LocalDateTime expTime;

}
