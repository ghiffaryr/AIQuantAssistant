from typing import Dict
from api.status_controller import (
    Status
)
from api.scrapper_controller import (
    ScrapperStockStatistics,
    ScrapperStockAnalysis,
    ScrapperStockNews
)


ROUTES: Dict[str, type] = {
    "/": Status,
    "/scrapper/stock/{stock_code}/statistics": ScrapperStockStatistics,
    "/scrapper/stock/{stock_code}/analysis": ScrapperStockAnalysis,
    "/scrapper/stock/{stock_code}/news": ScrapperStockNews
}