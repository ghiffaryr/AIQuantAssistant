from utils.endpoint_decorator import EndpointDecorator
from utils.validation import Validation
from loguru import logger
from service.impl.forecast_service_impl import ForecastServiceImpl
from const.param import Param


class ForecastPredict:
    async def on_post(self, req, resp) -> None:
        @EndpointDecorator.error_handling
        def get_result(params):
            logger.info(f"Params passed: {params}")
            required_params = [
                    Param.STOCK_CODE,
                    Param.TRAINING_WINDOW,
                    Param.MODEL_CHOICE,
                    Param.FORECASTING_HORIZON
            ]
            default_optional_params = {
                    Param.IMPUTE_METHOD: "ffill"
            }
            required_params = Validation.check_required_params(params, required_params)
            optional_params = Validation.check_optional_params(params, default_optional_params)
            params = {**required_params, **optional_params}
            logger.info(f"Params processed: {params}")

            forecast_service = ForecastServiceImpl()
            forecast_service.retrieve_dataset(stock_code=params[Param.STOCK_CODE])
            forecast_service.impute_dataset(method=params[Param.IMPUTE_METHOD])
            forecast_service.configure_training_parameter(training_window=params[Param.TRAINING_WINDOW], 
                                            model_choice=params[Param.MODEL_CHOICE])
            forecast_service.train()
            prediction = forecast_service.predict(params[Param.FORECASTING_HORIZON])
            return prediction
            
        params = await req.media(format='json')
        res = get_result(params)
        resp.text = res