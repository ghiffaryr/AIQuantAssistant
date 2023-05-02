from flask import Blueprint, render_template, request, json
from api.routes import Category, Route
import yfinance as yf
import numpy as np
import pandas as pd
from autots import AutoTS
from prophet import Prophet
from neuralprophet import NeuralProphet
import plotly.graph_objects as go
from plotly.utils import PlotlyJSONEncoder


api_predict = Blueprint(Category.PREDICT, __name__, template_folder='templates')

@api_predict.route(Route.POST_PREDICT, methods=['POST'])
def predict():
    if request.method == 'POST':
        """
        {
            "stock_code":"TLKM.JK",
            "training_window":2,
            "model_choice":"autots",
            "forecasting_horizon":1
        }
        """
        request_body = request.get_json()
        print(request_body)
        
        # Get dataset
        try:
            stock_code = request_body["stock_code"]
        except:
            return json.dumps({"errors": [{"code":"400", "message":"Invalid stock code!"}]}), 400
        try:
            stock = yf.download(stock_code)
        except:
            return json.dumps({"errors": [{"code":"500", "message":"Fetching stock data failed!"}]}), 500
        df = stock[['Open', 'High', 'Low', 'Close', 'Volume']]
        df['Date'] = df.index
        df = df.reset_index(drop=True)
        df = df.sort_values(by=['Date'], ascending=True)
        df = df.set_index("Date")
        df = df.asfreq("D")
        df = df.reset_index()
        df.head()
        
        num_column = ['Open', 'High', 'Low', 'Close', 'Volume']
        numerical = ['Volume']
        currency = ['Open', 'High', 'Low', 'Close']
        dt_column = ['Date']
        
        # Impute Holiday
        for col in num_column:
            df[col] = df[col].fillna(method='ffill')
            
        # Last months training window relative to dataset maximum date
        try:
            training_window = request_body["training_window"]
        except:
            training_window = None
        if training_window is not None and training_window > 1:
            n = training_window
        else: n = 1 
        last_nm = df['Date'].max()-pd.DateOffset(months=n)
        df_train = df[(df['Date'] > last_nm)]
        
        # Modeling
        try:
            model_choice = request_body["model_choice"]
        except:
            model_choice = "autots"
            
        try:
            forecasting_horizon = request_body["forecasting_horizon"]
        except:
            forecasting_horizon = 1        
        
        if model_choice.lower() == "autots":
            try:
                autots = AutoTS(frequency = 'D',
                    prediction_interval = 0.95,
                    ensemble = None,
                    model_list="superfast",  # "superfast", "default", "fast_parallel"
                    transformer_list="superfast"  # "superfast"
                    )
                model = autots.fit(df_train, 
                        date_col='Date', 
                        value_col='Close', 
                        id_col=None,
                        )
                
                # Forecast to n days in the future
                df_before = df
                if forecasting_horizon is not None: 
                    periods = forecasting_horizon * 30
                else: 
                    periods = 30
                future_daterange = pd.date_range(start=df_before['Date'].max()+pd.Timedelta(1, unit='d'), periods=periods)
                
                prediction = model.predict(forecast_length = periods)
                forecast = prediction.forecast['Close']
                lower_series = prediction.upper_forecast['Close']
                upper_series = prediction.lower_forecast['Close']

                # Plot
                fig = go.Figure()
                fig.add_trace(go.Scatter(x=df_before['Date'], y=df_before['Close'], name='Actual',  marker_color='blue'))
                fig.add_trace(go.Scatter(x=future_daterange, y=forecast, name='Forecast AutoTS',  marker_color='red'))
                fig.add_trace(go.Scatter(x=future_daterange, y=lower_series, mode='lines', name='Forecast AutoTS Lower', marker_color='orange')) 
                fig.add_trace(go.Scatter(x=future_daterange, y=upper_series, fill='tonexty', name='Forecast AutoTS Upper', marker_color='orange'))
                fig.update_layout(
                    title={'text': f"Close AutoTS Prediction {periods} Days Forecasting Horizon",
                        'y':1,
                        'x':0.5,
                        'xanchor': 'center',
                        'yanchor': 'top'},
                    xaxis_title="Time",
                    yaxis_title="Price (USD)",
                    legend_title=stock_code
                )
                # fig.show()
                
                # Create graphJSON
                graphJSON = json.dumps(fig, cls=PlotlyJSONEncoder)
                
                # Use render_template to pass graphJSON to html
                # return render_template('plot.html', graphJSON=graphJSON)
                return graphJSON
            except Exception as e:
                return json.dumps({"errors": [{"code":"500", "message":str(e)}]}), 500
        
        elif model_choice.lower() == "facebookprophet":
            try:
                fbp = Prophet()

                model_fbp = fbp.fit(df_train[["Date", "Close"]].rename(columns={"Date": "ds", "Close": "y"}))
                
                # Forecast to n days in the future
                df_before = df
                if forecasting_horizon is not None: 
                    periods = forecasting_horizon * 30
                else: 
                    periods = 30
                
                future_daterange = pd.date_range(start=df_before['Date'].max()+pd.Timedelta(1, unit='d'), periods=periods)
                
                future = model_fbp.make_future_dataframe(periods=periods)
                prediction = model_fbp.predict(future)
                forecast = prediction['yhat'][-periods:]
                lower_series = prediction['yhat_lower'][-periods:]
                upper_series = prediction['yhat_upper'][-periods:]
                
                # Plot
                fig = go.Figure()
                fig.add_trace(go.Scatter(x=df_before['Date'], y=df_before['Close'], name='Actual',  marker_color='blue'))
                fig.add_trace(go.Scatter(x=future_daterange, y=forecast, name='Forecast Facebook Prophet',  marker_color='red'))
                fig.add_trace(go.Scatter(x=future_daterange, y=lower_series, mode='lines', name='Forecast Facebook Prophet Lower', marker_color='orange'))
                fig.add_trace(go.Scatter(x=future_daterange, y=upper_series, fill='tonexty', name='Forecast Facebook Prophet Upper', marker_color='orange'))
                fig.update_layout(
                    title={'text': f"Close Facebook Prophet Prediction {periods} Days Forecasting Horizon",
                        'y':0.9,
                        'x':0.5,
                        'xanchor': 'center',
                        'yanchor': 'top'},
                    xaxis_title="Time",
                    yaxis_title="Price (USD)",
                    legend_title=stock_code
                )
                # fig.show()
                
                # Create graphJSON
                graphJSON = json.dumps(fig, cls=PlotlyJSONEncoder)
                
                # Use render_template to pass graphJSON to html
                # return render_template('plot.html', graphJSON=graphJSON)
                return graphJSON
            except Exception as e:
                return json.dumps({"errors": [{"code":"500", "message":str(e)}]}), 500
        
        elif model_choice == "neuralprophet":
            try:
                model_np = NeuralProphet()

                metrics = model_np.fit(df_train[["Date", "Close"]].rename(columns={"Date": "ds", "Close": "y"}), progress="plot")
                
                # Forecast to n days in the future
                df_before = df
                if forecasting_horizon is not None: 
                    periods = forecasting_horizon * 30
                else: 
                    periods = 30
                
                future_daterange = pd.date_range(start=df_before['Date'].max()+pd.Timedelta(1, unit='d'), periods=periods)
                
                future = model_np.make_future_dataframe(periods=periods, df=df_before[["Date", "Close"]].rename(columns={"Date": "ds", "Close": "y"}))
                prediction = model_np.predict(future)
                forecast = prediction['yhat1'][-periods:]
                
                # Plot
                fig = go.Figure()
                fig.add_trace(go.Scatter(x=df_before['Date'], y=df_before['Close'], name='Actual',  marker_color='blue'))
                fig.add_trace(go.Scatter(x=future_daterange, y=forecast, name='Forecast Neural Prophet',  marker_color='red'))
                fig.update_layout(
                    title={'text': f"Close Neural Prophet Prediction {periods} Days Forecasting Horizon",
                        'y':0.9,
                        'x':0.5,
                        'xanchor': 'center',
                        'yanchor': 'top'},
                    xaxis_title="Time",
                    yaxis_title="Price (USD)",
                    legend_title=stock_code
                )
                # fig.show()
                
                # Create graphJSON
                graphJSON = json.dumps(fig, cls=PlotlyJSONEncoder)
                
                # Use render_template to pass graphJSON to html
                # return render_template('plot.html', graphJSON=graphJSON)
                return graphJSON
            except Exception as e:
                return json.dumps({"errors": [{"code":"500", "message":str(e)}]}), 500
        else:
            return json.dumps({"errors": [{"code":"400", "message":"Unsupported model choice!"}]}), 400