from const.forecast_model import ForecastModelList
from dto.dictionary import DictionarySchema
from utils.endpoint_decorator import EndpointDecorator


class ForecastModelDictionary:
    async def on_get(self, req, resp) -> None:
        @EndpointDecorator.error_handling
        def get_result():
            res = ForecastModelList
            return res
        res = get_result()
        resp.media = DictionarySchema(many=True).dump(res)