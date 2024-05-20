from abc import ABC, abstractmethod


class ForecastService(ABC):
    @abstractmethod
    def retrieve_dataset(self) -> None:
        pass

    @abstractmethod
    def impute_dataset(self) -> None:
        pass

    @abstractmethod
    def configure_training_parameter(self) -> None:
        pass

    @abstractmethod
    def train(self) -> None:
        pass

    @abstractmethod
    def predict(self) -> None:
        pass
