class Category:
    HOME = "home"
    PREDICT = "predict"

class Route:
    DEFAULT = "/"

    BASE_API = "/api"

    POST_PREDICT = "{0}/{1}".format(BASE_API, Category.PREDICT)