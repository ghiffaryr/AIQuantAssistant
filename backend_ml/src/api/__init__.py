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
    "/sentiment/predict": SentimentPredict,
    "/topic/predict": TopicPredict,
    "/summary/predict": SummarizerPredict
}