import responder
from api import ROUTES
from dto import DTOS
from __init__  import __version__
from utils.config import Config


description = "This is a sample server."
terms_of_service = "http://example.com/terms/"
contact = {
    "name": "API Support",
    "url": "http://www.example.com/support",
    "email": "support@example.com",
}
license = {
    "name": "Apache 2.0",
    "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
}

DEFAULT_PREFIX = "/api/v0"
OPENAPI_PARAMS = {
    "title": "Scrapper",
    "version": __version__,
    "openapi": "3.0.2",
    "docs_route": "/docs",
    "description": description,
    "terms_of_service": terms_of_service,
    "contact": contact,
    "license": license,
}

class API(responder.API):
    def __init__(self, prefix=None, **kwargs):
        if prefix is None:
            prefix = DEFAULT_PREFIX
            
        OPENAPI_PARAMS['docs_route'] = prefix + OPENAPI_PARAMS['docs_route']

        params = {}
        params.update(OPENAPI_PARAMS)
        params.update(kwargs)

        super().__init__(**params)        

        for route, service in ROUTES.items():
            self.add_route(prefix + route, service)

        for name, dto in DTOS.items():
            self.schema(name)(dto)            

cors_options = {
    "cors": True,
    "cors_params": {
        "allow_origins": ["*"],
        "allow_methods": ["*"],
        "allow_headers": ["*"],
    }
}
StartApplication = API(prefix=Config.get()['server']['servlet']['context_path'],
                       **cors_options)


if __name__ == '__main__':
    StartApplication.run()
