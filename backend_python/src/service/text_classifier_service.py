from abc import ABC, abstractmethod


class TextClassifierService(ABC):
    @abstractmethod
    def initialize(self) -> None:
        pass

    @abstractmethod
    def predict(self) -> None:
        pass
