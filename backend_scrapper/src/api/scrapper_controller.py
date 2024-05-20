from utils.endpoint_decorator import EndpointDecorator
from utils.validation import Validation
from loguru import logger
from service.impl.scrapper_service_stock_statistics_impl import ScrapperServiceStockStatisticsImpl
from service.impl.scrapper_service_stock_analysis_impl import ScrapperServiceStockAnalysisImpl
from service.impl.scrapper_service_stock_news_impl import ScrapperServiceStockNewsImpl
from const.param import Param


class ScrapperStockStatistics:
    async def on_post(self, req, resp, stock_code) -> None:
        @EndpointDecorator.error_handling
        def get_result(params):            
            logger.info(f"Params passed: {params}")
            required_params = [
                    Param.STOCK_CODE
            ]
            required_params = Validation.check_required_params(params, required_params)
            params = {**required_params}
            logger.info(f"Params processed: {params}")

            scrapper_stock_statistics = ScrapperServiceStockStatisticsImpl()
            scrapper_stock_statistics.initialize()
            scrapper_stock_statistics.configure(params[Param.STOCK_CODE])
            result = scrapper_stock_statistics.retrieve()
            scrapper_stock_statistics.end()
            return result
        params = {Param.STOCK_CODE: stock_code}
        res = get_result(params)
        resp.media = res

class ScrapperStockAnalysis:
    async def on_post(self, req, resp, stock_code) -> None:
        @EndpointDecorator.error_handling
        def get_result(params):            
            logger.info(f"Params passed: {params}")
            required_params = [
                    Param.STOCK_CODE
            ]
            required_params = Validation.check_required_params(params, required_params)
            params = {**required_params}
            logger.info(f"Params processed: {params}")

            scrapper_stock_analysis = ScrapperServiceStockAnalysisImpl()
            scrapper_stock_analysis.initialize()
            scrapper_stock_analysis.configure(params[Param.STOCK_CODE])
            result = scrapper_stock_analysis.retrieve()
            scrapper_stock_analysis.end()
            return result
        params = {Param.STOCK_CODE: stock_code}
        res = get_result(params)
        resp.media = res

class ScrapperStockNews:
    async def on_post(self, req, resp, stock_code) -> None:
        @EndpointDecorator.error_handling
        def get_result(params):            
            logger.info(f"Params passed: {params}")
            required_params = [
                    Param.STOCK_CODE,
                    Param.START_INDEX,
                    Param.LENGTH
            ]
            required_params = Validation.check_required_params(params, required_params)
            params = {**required_params}
            logger.info(f"Params processed: {params}")

            scrapper_news = ScrapperServiceStockNewsImpl()
            scrapper_news.initialize()
            scrapper_news.configure(params[Param.STOCK_CODE])
            result = scrapper_news.retrieve(start_index=int(params[Param.START_INDEX]),
                                            length=int(params[Param.LENGTH]))
            scrapper_news.end()
            return result
        params = await req.media(format='json')
        params = {Param.STOCK_CODE: stock_code,
                  **params}
        res = get_result(params)
        resp.media = res