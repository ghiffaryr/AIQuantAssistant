from flask import Flask
from flask_cors import CORS
from home.view import api_home
from predict.view import api_predict

app = Flask(__name__)
cors = CORS(app)
app.register_blueprint(api_home)
app.register_blueprint(api_predict)

if __name__ == "__main__":
    app.run(debug=True)