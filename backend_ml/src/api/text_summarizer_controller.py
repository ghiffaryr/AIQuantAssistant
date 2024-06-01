from utils.endpoint_decorator import EndpointDecorator
from utils.validation import Validation
from loguru import logger
from service.impl.text_summarizer_service_impl import TextSummarizerServiceImpl
from const.param import Param


class SummarizerPredict:
    async def on_post(self, req, resp) -> None:
        @EndpointDecorator.error_handling
        def get_result(params):
            logger.info(f"Params passed: {params}")
            required_params = [
                    Param.INPUT
            ]
            required_params = Validation.check_required_params(params, required_params)
            params = {**required_params}
            logger.info(f"Params processed: {params}")
            text_summarizer = TextSummarizerServiceImpl.instance()
            prediction = text_summarizer.predict(params[Param.INPUT])
            return prediction
            
        params = await req.media(format='json')
        res = get_result(params)
        resp.text = res

class SummarizerAllPredict:
    async def on_post(self, req, resp) -> None:
        @EndpointDecorator.error_handling
        def get_result(params):
            logger.info(f"Params passed: {params}")
            required_params = [
                    Param.INPUT
            ]
            required_params = Validation.check_required_params(params, required_params)
            params = {**required_params}
            logger.info(f"Params processed: {params}")
            text_summarizer = TextSummarizerServiceImpl.instance("facebook/bart-large-cnn")
            prediction = text_summarizer.predict(params[Param.INPUT])
            return prediction
            
        params = await req.media(format='json')
        res = get_result(params)
        resp.text = res    