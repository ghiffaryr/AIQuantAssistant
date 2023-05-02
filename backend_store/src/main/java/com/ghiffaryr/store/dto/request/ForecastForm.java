package com.ghiffaryr.store.dto.request;

import lombok.Data;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

@Data
public class ForecastForm {

    @NotBlank(message = "Stock code must not be blank")
    String stockCode;

    @Min(message = "Training window must be greater than or equal to 1",
            value = 1)
    Integer trainingWindow;

    @Min(message = "Forecasting horizon must be greater than or equal to 1",
            value = 1)
    Integer forecastingHorizon;

}
