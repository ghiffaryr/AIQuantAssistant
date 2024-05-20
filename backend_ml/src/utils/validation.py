from loguru import logger

class Validation:

    @classmethod
    def check_required_params(cls, params, required_params, type_request="body"):
        keys = set(params.keys())
        values = params.values()

        if not any(param in keys for param in required_params):
            raise Exception(f"Missing required parameters {required_params} in {type_request}")
        elif not any(value is not None for value in values):
            raise Exception(f"Missing required parameters {required_params} in {type_request}")
        else:
            return params
        
    @classmethod
    def check_optional_params(self, params, default_optional_params={}, type_request="body"):
        keys = list(set(params.keys()))
        missing_params = [p for p in default_optional_params.keys() if p not in keys]
        for key, value in default_optional_params.items():
            if key in missing_params:
                params[key] = value if str(value) not in keys else params[value]
                logger.info(f"Missing optional parameter {key} in {type_request}: Set default value '{params[key]}'.")
                missing_params.remove(key)
                keys.append(key)
        return params    