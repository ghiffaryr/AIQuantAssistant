from typing import Dict
from api.status_controller import (
    Status
)
from api.forecast_controller import (
    ForecastPredict
)
from api.dictionary_controller import (
    ForecastModelDictionary
)
from api.scrapper_controller import (
    ScrapperStockStatistics,
    ScrapperStockAnalysis
)
from api.text_classifier_controller import (
    SentimentPredict,
    TopicPredict
)
from api.text_summarizer_controller import (
    SummarizerPredict
)


ROUTES: Dict[str, type] = {
    "/": Status,
    "/forecast/predict": ForecastPredict,
    "/forecast/dictionary": ForecastModelDictionary,
    "/scrapper/stock/{stock_code}/statistics": ScrapperStockStatistics,
    "/scrapper/stock/{stock_code}/analysis": ScrapperStockAnalysis,
    "/sentiment/predict": SentimentPredict,
    "/topic/predict": TopicPredict,
    "/summary/predict": SummarizerPredict
}