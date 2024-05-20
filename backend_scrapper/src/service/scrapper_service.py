from abc import ABC, abstractmethod


class ScrapperService(ABC):
    @abstractmethod
    def initialize(self) -> None:
        pass

    @abstractmethod
    def configure(self) -> None:
        pass

    @abstractmethod
    def retrieve(self) -> None:
        pass

    @abstractmethod
    def end(self) -> None:
        pass