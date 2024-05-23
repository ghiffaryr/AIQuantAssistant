from service.text_classifier_service import TextClassifierService
from transformers import pipeline


class TextClassifierServiceSentimentImpl(TextClassifierService):
    _instance = None

    def __init__(self):
        raise RuntimeError('Call instance() instead')
    
    @classmethod
    def instance(cls, 
                 model_choice: str = "mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis"):
        if cls._instance != None:
            if model_choice != cls._instance.model_choice:
                del cls._instance._pipe
                cls._instance = None
        if cls._instance is None:
            cls._instance = cls.__new__(cls)
            cls._instance._init_instance(model_choice)
        return cls._instance

    def _init_instance(self,
                       model_choice: str) -> None:
        self._pipe = None
        self.model_choice = model_choice
        self.initialize(model_choice)
        self.result = None

    def initialize(self,
                   model_choice: str) -> None:
        try:
            self._pipe = pipeline("text-classification", model="./tmp/"+model_choice.replace("/","_"))
        except:
            self._pipe = pipeline("text-classification", model=model_choice)
            self._pipe.save_pretrained("./tmp/"+model_choice.replace("/","_"))        

    def predict(self, 
                input: str):
        result = self._pipe(input)
        self.result = result
        return result