from service.forecast_service import ForecastService
from typing import Union
import pandas as pd
import yfinance as yf
import numpy as np
import pandas as pd
from autots import AutoTS
from prophet import Prophet
from neuralprophet import NeuralProphet
import plotly.graph_objects as go
from plotly.utils import PlotlyJSONEncoder
import json
from const.forecast_model import ForecastModel


class ForecastServiceImpl(ForecastService):
    def __init__(self) -> None:
        self._stock_code = None
        self._df = pd.DataFrame()
        self._impute_method = None
        self._df_train = pd.DataFrame()
        self._model = None
        self._forecast = pd.Series(dtype=np.float64)
        self._upper_series = pd.Series(dtype=np.float64)
        self._lower_series = pd.Series(dtype=np.float64)
        self.result = json.dumps({})

    def retrieve_dataset(self, 
                         stock_code: str) -> None:
        self._stock_code = stock_code
        dataset = yf.download(self._stock_code)        
        df = dataset[["Open", "High", "Low", "Close", "Volume"]]
        df["Date"] = df.index
        df = df.reset_index(drop=True)
        df = df.sort_values(by=["Date"], ascending=True)
        df = df.set_index("Date")
        df = df.asfreq("D")
        df = df.reset_index()
        self._df = df

    def impute_dataset(self,
                       method: str = "ffill") -> None:
        for col in self.features:
            self._df[col] = self._df[col].fillna(method=method)
        self._impute_method = method
        print("self._impute_method: ",self._impute_method)

    def configure_training_parameter(self, 
                                     training_window: int, 
                                     model_choice: str) -> None:
        self._model_choice = model_choice.lower()
        if training_window <1:
            raise "Training window must be greater or equal to 1 (month)"
        if training_window < 3 and self._model_choice == ForecastModel.AutoTS.code:
            raise "Training window must be greater or equal to 3 (month) for AutoTS!"
        self._training_window = training_window
        # Last months training window relative to dataset maximum date
        last_n_months = self._df["Date"].max()-pd.DateOffset(months=training_window)
        self._df_train = self._df[(self._df["Date"] > last_n_months)]

    def train(self) -> None:
        if self._model_choice == ForecastModel.AutoTS.code:
            autots = AutoTS(frequency = "D",
                            prediction_interval = 0.95,
                            ensemble = None,
                            model_list="superfast",  # "superfast", "default", "fast_parallel"
                            transformer_list="superfast"  # "superfast"
                            )
            self._model = autots.fit(self._df_train, 
                                    date_col="Date", 
                                    value_col="Close", 
                                    id_col=None
                                    )
        elif self._model_choice == ForecastModel.FacebookProphet.code:
            fbp = Prophet()
            self._model = fbp.fit(self._df_train[["Date", "Close"]].rename(columns={"Date": "ds", "Close": "y"}))
        elif self._model_choice == ForecastModel.NeuralProphet.code:
            model_np = NeuralProphet()
            model_np.fit(self._df_train[["Date", "Close"]].rename(columns={"Date": "ds", "Close": "y"}), progress="plot")
            self._model = model_np
        else:
            return "Unsupported model choice!"

    def predict(self, 
                 forecasting_horizon: int) -> None:
        #Forecast to n days in the future
        periods = forecasting_horizon * 30
        future_daterange = pd.date_range(start=self._df["Date"].max()+pd.Timedelta(1, unit="d"), periods=periods)
        
        if isinstance(self._model, AutoTS):
            prediction = self._model.predict(forecast_length=periods)
            self._forecast = prediction.forecast["Close"]
            self._lower_series = prediction.lower_forecast["Close"]
            self._upper_series = prediction.upper_forecast["Close"]
            # Plot
            fig = go.Figure()
            fig.add_trace(go.Scatter(x=self._df["Date"], y=self._df["Close"], name="Actual",  marker_color="blue"))
            fig.add_trace(go.Scatter(x=future_daterange, y=self._forecast, name=f"Forecast {ForecastModel.AutoTS.name}",  marker_color="red"))
            fig.add_trace(go.Scatter(x=future_daterange, y=self._lower_series, mode="lines", name=f"Forecast {ForecastModel.AutoTS.name} Lower", marker_color="orange")) 
            fig.add_trace(go.Scatter(x=future_daterange, y=self._upper_series, fill="tonexty", name=f"Forecast {ForecastModel.AutoTS.name} Upper", marker_color="orange"))
            fig.update_layout(
                title={"text": f"Close {ForecastModel.AutoTS.name} Prediction {periods} Days Forecasting Horizon",
                    "y":1,
                    "x":0.5,
                    "xanchor": "center",
                    "yanchor": "top"},
                xaxis_title="Time",
                yaxis_title="Price (USD)",
                legend_title=self._stock_code
            )
            # Create graphJSON
            graphJSON = json.dumps(fig, cls=PlotlyJSONEncoder)
            self.result = graphJSON
            return graphJSON
        elif isinstance(self._model, Prophet):
            future = self._model.make_future_dataframe(periods=periods)
            prediction = self._model.predict(future)
            forecast = prediction["yhat"][-periods:]
            lower_series = prediction["yhat_lower"][-periods:]
            upper_series = prediction["yhat_upper"][-periods:]
            
            # Plot
            fig = go.Figure()
            fig.add_trace(go.Scatter(x=self._df["Date"], y=self._df["Close"], name="Actual",  marker_color="blue"))
            fig.add_trace(go.Scatter(x=future_daterange, y=forecast, name=f"Forecast {ForecastModel.FacebookProphet.name}",  marker_color="red"))
            fig.add_trace(go.Scatter(x=future_daterange, y=lower_series, mode="lines", name=f"Forecast {ForecastModel.FacebookProphet.name} Lower", marker_color="orange"))
            fig.add_trace(go.Scatter(x=future_daterange, y=upper_series, fill="tonexty", name=f"Forecast {ForecastModel.FacebookProphet.name} Upper", marker_color="orange"))
            fig.update_layout(
                title={"text": f"Close {ForecastModel.FacebookProphet.name} Prediction {periods} Days Forecasting Horizon",
                    "y":0.9,
                    "x":0.5,
                    "xanchor": "center",
                    "yanchor": "top"},
                xaxis_title="Time",
                yaxis_title="Price (USD)",
                legend_title=self._stock_code
            )            
            # Create graphJSON
            graphJSON = json.dumps(fig, cls=PlotlyJSONEncoder)
            self.result = graphJSON
            return graphJSON
        elif isinstance(self._model, NeuralProphet):
            future = self._model.make_future_dataframe(periods=periods, df=self._df[["Date", "Close"]].rename(columns={"Date": "ds", "Close": "y"}))
            prediction = self._model.predict(future)
            forecast = prediction["yhat1"][-periods:]
            # Plot
            fig = go.Figure()
            fig.add_trace(go.Scatter(x=self._df["Date"], y=self._df["Close"], name="Actual",  marker_color="blue"))
            fig.add_trace(go.Scatter(x=future_daterange, y=forecast, name=f"Forecast {ForecastModel.NeuralProphet.name}",  marker_color="red"))
            fig.update_layout(
                title={"text": f"Close {ForecastModel.NeuralProphet.name} Prediction {periods} Days Forecasting Horizon",
                    "y":0.9,
                    "x":0.5,
                    "xanchor": "center",
                    "yanchor": "top"},
                xaxis_title="Time",
                yaxis_title="Price (USD)",
                legend_title=self._stock_code
            )
            # Create graphJSON
            graphJSON = json.dumps(fig, cls=PlotlyJSONEncoder)
            self.result = graphJSON
            return graphJSON            
        else:
            return "Model is not available!"