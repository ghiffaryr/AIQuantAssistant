import os
import traceback
from functools import wraps
from loguru import logger
from utils.custom_exception import CustomException


class EndpointDecorator:
    def error_handling(func, schema=None):
        @wraps(func)
        def wrapper(*args, **kwargs):
            names = func.__qualname__.split(".")
            endpoint_name = f"{names[0]}.{names[1]}"
            try:
                logger.info(f"Entering {endpoint_name} process")
                res = func(*args, **kwargs)
                logger.success(f"Return result of {endpoint_name} process")
            except CustomException as e:
                error_message = repr(e)
                logger.error(f"Error in {endpoint_name}: {error_message}")
                for lines in traceback.format_tb(e.__traceback__):
                    for line in lines.split("\n"):
                        logger.error(line)
                res = {}
                res["errors"] = [{
                    "code": e.code,
                    "message": error_message
                }]
            except Exception as e:
                error_message = repr(e)
                logger.error(f"Error in {endpoint_name}: {error_message}")
                for lines in traceback.format_tb(e.__traceback__):
                    for line in lines.split("\n"):
                        logger.error(line)
                res = {}
                res["errors"] = [{
                    "code": 500,
                    "message": error_message
                }]
            finally:
                return res
        return wrapper