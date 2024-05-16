from utils.endpoint_decorator import EndpointDecorator
from utils.validation import Validation
from loguru import logger
from service.impl.scrapper_service_stock_statistics_impl import ScrapperServiceStockStatisticsImpl
from service.impl.scrapper_service_stock_analysis_impl import ScrapperServiceStockAnalysisImpl
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
            scrapper_stock_statistics.configure(stock_code)
            result = scrapper_stock_statistics.retrieve()
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
            scrapper_stock_analysis.configure(stock_code)
            result = scrapper_stock_analysis.retrieve()
            return result
        params = {Param.STOCK_CODE: stock_code}
        res = get_result(params)
        resp.media = res