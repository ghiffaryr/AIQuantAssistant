class CustomException(Exception):
    def __init__(self, code, message=""):
        self.code: int = code
        super().__init__(message)
