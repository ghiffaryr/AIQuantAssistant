package com.ghiffaryr.store.dto.request;

import lombok.Data;

@Data
public class PredictForm {

    String stockCode;
    Integer trainingWindow;
    Integer forecastingHorizon;
    String input;

}
