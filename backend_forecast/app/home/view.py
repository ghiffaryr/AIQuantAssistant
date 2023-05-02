from flask import Blueprint
from api.routes import Category, Route


api_home = Blueprint(Category.HOME, __name__)

@api_home.route(Route.DEFAULT, methods=['GET'])
def home():
    return "Forecaster is ready!"