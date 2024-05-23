from utils.endpoint_decorator import EndpointDecorator
from utils.validation import Validation
from loguru import logger
from service.impl.text_classifier_service_sentiment_impl import TextClassifierServiceSentimentImpl
from service.impl.text_classifier_service_topic_impl import TextClassifierServiceTopicImpl
from const.param import Param
from dto.text_classifier import TextClassifierSchema


class SentimentPredict:
    async def on_get(self, req, resp) -> None:
        @EndpointDecorator.error_handling
        def get_result(params):
            logger.info(f"Params passed: {params}")
            required_params = [
                    Param.INPUT
            ]
            required_params = Validation.check_required_params(params, required_params)
            params = {**required_params}
            logger.info(f"Params processed: {params}")
            text_classifier_sentiment = TextClassifierServiceSentimentImpl.instance()
            prediction = text_classifier_sentiment.predict(params[Param.INPUT])
            return prediction
            
        params = await req.media(format='json')
        res = get_result(params)
        resp.media = TextClassifierSchema(many=True).dump(res)

class TopicPredict:
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
            text_classifier_topic = TextClassifierServiceTopicImpl.instance()
            prediction = text_classifier_topic.predict(params[Param.INPUT])
            return prediction
            
        params = await req.media(format='json')
        res = get_result(params)
        resp.media = TextClassifierSchema(many=True).dump(res)