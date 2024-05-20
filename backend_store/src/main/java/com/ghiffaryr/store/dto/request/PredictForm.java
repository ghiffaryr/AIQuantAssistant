package com.ghiffaryr.store.dto.request;

import lombok.Data;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

@Data
public class PredictForm {

    String stockCode;
    Integer trainingWindow;
    Integer forecastingHorizon;
    String input;

}
