from service.text_summarizer_service import TextSummarizerService
from transformers import pipeline


class TextSummarizerServiceImpl(TextSummarizerService):
    _instance = None

    def __init__(self):
        raise RuntimeError('Call instance() instead')
    
    @classmethod
    def instance(cls, 
                 model_choice: str = "Falconsai/text_summarization"):
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
        self._pipe = pipeline("summarization", model=model_choice)
        self._pipe.save_pretrained("./tmp/"+model_choice.replace("/","_"))
        del self._pipe
        self._pipe = pipeline("summarization", model="./tmp/"+model_choice.replace("/","_"))

    def predict(self, 
                input: str,
                max_length: str = 1024, 
                min_length: str = 33, 
                do_sample: str = False,
                **kwargs):
        result = self._pipe(input,
                            max_length=max_length,
                            min_length=min_length,
                            do_sample=do_sample,
                            **kwargs)[0]['summary_text']
        self.result = result
        return result