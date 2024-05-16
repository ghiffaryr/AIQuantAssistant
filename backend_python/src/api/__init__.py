from typing import Dict
from api.status_controller import (
    Status
)
from api.forecast_controller import (
    Predict
)
from api.dictionary_controller import (
    ForecastModelDictionary
)
from api.scrapper_controller import (
    ScrapperStockStatistics,
    ScrapperStockAnalysis
)

ROUTES: Dict[str, type] = {
    "/": Status,
    "/forecast/predict": Predict,
    "/forecast/dictionary": ForecastModelDictionary,
    "/scrapper/stock/{stock_code}/statistics": ScrapperStockStatistics,
    "/scrapper/stock/{stock_code}/analysis": ScrapperStockAnalysis
}