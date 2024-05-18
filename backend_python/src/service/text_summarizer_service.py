from abc import ABC, abstractmethod


class TextSummarizerService(ABC):
    @abstractmethod
    def initialize(self) -> None:
        pass

    @abstractmethod
    def predict(self) -> None:
        pass
