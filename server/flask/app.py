from flask import Flask,jsonify,Response
from flask_cors import CORS
import json
import requests
import time
import numpy as np
import pandas as pd
from concurrent.futures import ThreadPoolExecutor
from selenium.webdriver.support.ui import WebDriverWait
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from pathlib import Path
import os.path
from selenium.webdriver.common.by import By
from datetime import datetime,timedelta
import pytz
import yfinance as yf
from tensorflow import keras
import concurrent.futures
import numpy as np
from sklearn.metrics import r2_score, mean_squared_error
import gzip

ist_offset = 5.5 * 60 * 60  
ist_tz = pytz.timezone('Asia/Kolkata')
utc_now = datetime.now(pytz.utc)
ist_now = utc_now.astimezone(ist_tz)
ist_now = ist_now.replace(hour=0, minute=0, second=0, microsecond=0)
timestamp = int((ist_now.timestamp() + ist_offset))

app = Flask(__name__)
CORS(app,origins="*")


# @app.route("/history",methods=['POST'])
# def stockdata():
#     if(request.method=="POST"):
#         data=None
#         script = request.json.get("script")
#         downloads_path = str(Path.home() / "Downloads")
#         path = r"{}\{}.NS.csv".format(downloads_path,script)
#         jsonpath = r"{}\{}.NS.json".format(downloads_path,script)

#         if os.path.isfile(path):
#             os.remove(path)
            
#             driver = webdriver.Chrome('./chromedriver')
#             driver.set_window_position(-2000,0)
#             driver.minimize_window()
#             l= driver.get(f"https://query1.finance.yahoo.com/v7/finance/download/{script}.NS?period1=820454400&period2={timestamp}&interval=1d&events=history&includeAdjustedClose=true")
            
            
#             while not os.path.exists(path):
#                 time.sleep(1)
#             driver.close()
#             try:
#                 with open(path):
#                     db = pd.read_csv(path)
#                     data = db.to_dict(orient='records')
#                     json_data = []
#                     #final_data = {script:json_data}
#                     for row in data:
#                         json_data.append({ 
#                             'Date': row['Date'],
#                             'Open': row['Open'],
#                             'High':row['High'],
#                             'Low':row['Low'],
#                             'Close':row['Close'],
#                             'Volume':row['Volume']
#                             })
#                     with open(jsonpath, 'w') as json_file:
#                         json.dump(json_data, json_file)
#                     #db.to_json (jsonpath)
#                     f = open(jsonpath)
#                     jdata = json.load(f)
#                     f.close()
#                     return jsonify(jdata)
#             except IOError:
#                 logging.exception('')
#         else:
#             driver = webdriver.Chrome('./chromedriver')
#             driver.set_window_position(-2000,0)
#             driver.minimize_window()
#             l= driver.get(f"https://query1.finance.yahoo.com/v7/finance/download/{script}.NS?period1=820454400&period2={timestamp}&interval=1d&events=history&includeAdjustedClose=true")
            
            
#             while not os.path.exists(path):
#                 time.sleep(1)
#             driver.close()

#             try:
#                 with open(path):
#                     db = pd.read_csv(path)
#                     data = db.to_dict(orient='records')
#                     json_data = []
#                     #final_data = {script:json_data}
#                     for row in data:
#                         json_data.append({ 
#                             'Date': row['Date'],
#                             'Open': row['Open'],
#                             'High':row['High'],
#                             'Low':row['Low'],
#                             'Close':row['Close'],
#                             'Volume':row['Volume']
#                             })
#                     with open(jsonpath, 'w') as json_file:
#                         json.dump(json_data, json_file)
#                     #db.to_json (jsonpath)
#                     #r =requests.post(f"http://localhost:3000/{script}",files=)
#                     f = open(jsonpath)
#                     jdata = json.load(f)
#                     f.close()
#                     return jsonify(jdata)
#             except IOError:
#                 logging.exception('')

def download(script,period,time):
    x = yf.download(tickers = script, 
        period = period,         
        interval = time,       
        prepost = False,       
        repair = True)
    return x

def nifty50(period,time):
    x = yf.download(tickers = "ADANIENT.NS ADANIPORTS.NS", 
        period = period,         
        interval = time,       
        prepost = False,       
        repair = True)
    return x

def create_features(data):
    data.sort(key=lambda x: x['Date'])

    close_prices = pd.Series([entry['Close'] for entry in data])
    for i in range(len(data)):
        close = data[i].get('Close', 0)
        high = data[i].get('High', 0)
        low = data[i].get('Low', 0)
        open_price = data[i].get('Open', 0)
        volume = data[i].get('Volume', 0)

        data[i]['MA_9'] = compute_moving_average(close_prices, window=9)
        data[i]['MA_21'] = compute_moving_average(close_prices, window=21)

        data[i]['RSI'] = compute_rsi(close_prices, window=9)

        date_str = data[i].get('Date')
        if date_str:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
            day_of_week = date_obj.weekday()
            month = date_obj.month
            quarter = (month - 1) // 3 + 1

            data[i]['DayOfWeek'] = day_of_week
            data[i]['Month'] = month
            data[i]['Quarter'] = quarter

    return data

def compute_rsi(close_prices, window=9):

    close_series = pd.Series(close_prices)

    delta = close_series.diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)

    avg_gain = gain.rolling(window=window).mean()
    avg_loss = loss.rolling(window=window).mean()

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    return rsi.iloc[-1]


def prepare_data(data, lookback_window=30):
    X, y = [], []
    for i in range(len(data) - lookback_window):
        X.append(data[i:i + lookback_window])
        y.append(data[i + lookback_window]['Close'])
    return np.array(X), np.array(y)

def compute_moving_average(close_prices, window=5):
    ma = close_prices[-window:].mean()
    return ma

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def calculate_sigmoid_macd(data, short_window=12, long_window=26, signal_window=9):
    short_ema = data.ewm(span=short_window, adjust=False).mean()
    long_ema = data.ewm(span=long_window, adjust=False).mean()

    macd_line = short_ema - long_ema
    signal_line = macd_line.ewm(span=signal_window, adjust=False).mean()
    macd_histogram = macd_line - signal_line

    sigmoid_macd_line = sigmoid(macd_line)
    sigmoid_signal_line = sigmoid(signal_line)

    return sigmoid_macd_line, sigmoid_signal_line

def get_historical_data(historical_data):
    if historical_data is not None:
        historical_json = []
        for index, row in historical_data.iterrows():
            date_str = row["Date"].strftime("%Y-%m-%d")
            data_object = {
                "Date": date_str,
                "Open": row["Open"],
                "High": row["High"],
                "Low": row["Low"],
                "Close": row["Close"],
                "Volume": row["Volume"],
                "Adj Close": row["Adj Close"]
            }
            historical_json.append(data_object)

        historical_json_string = json.dumps(historical_json, indent=4)
        with open("historical_data.json", "w") as json_file:
            json_file.write(historical_json_string)

        return historical_json_string  
    else:
        print("No data available.")


def data_processing(data):
    lowest_close = min(data, key=lambda x: x['Close'])['Close']
    highest_close = max(data, key=lambda x: x['Close'])['Close']

    json_data = []
    for row in data:
        json_data.append({
            'Close':row["Close"],
            # 'High':row["High"],
            # 'Low':row["Low"],
            # 'Open':row['Open']
        })


    stock_data = create_features(data)

    pdData = pd.DataFrame(stock_data)

    with_rsi = []

    rsi_with_date=[]
    close_prices = pd.Series([entry['Close'] for entry in data])
    volume = pd.Series([entry['Volume'] for entry in data])
    date = pd.Series([entry['Date']for entry in data])
    results_df = pd.DataFrame(columns=['Close', 'RSI','Volume'])


    for i in range(len(close_prices) - 9):
        current_sequence = close_prices[i:i + 9]
        current_date = date[i+8]
        current_rsi = compute_rsi(current_sequence, window=9)
        rsi_value = current_rsi
        ma9 = compute_moving_average(current_sequence, window=9)
        ma9_val = ma9
        sigmoid_macd_line,sigmoid_macd_signal = calculate_sigmoid_macd(close_prices,short_window=12, long_window=26, signal_window=9)
        line = sigmoid_macd_line
        signal = sigmoid_macd_signal
        close_price = current_sequence

        with_rsi.append({
            'RSI': round(rsi_value/100, 2),
            })
        rsi_with_date.append({
            "Date": current_date,
            'RSI': round(rsi_value/100, 2)
        })

    features = ["RSI"]

    json_data = json.dumps(rsi_with_date)  
    dataset = []
    for entry in with_rsi:
            sample = []
            for feature in features:
                value = entry.get(feature)
                if value is None:
                    sample.append(0)
                else:
                    sample.append(value)
            dataset.append(sample)
    dataset = np.array(dataset)
    return dataset,json_data 

def spliting_data_test(data):
    n_steps = 5

    X = []
    y = []

    for i in range(n_steps, len(data)):
        X.append(data[i+1 - n_steps:i+1])
        y.append(data[i])

    X = np.array(X)
    y = np.array(y)

    split_ratio = 0.9
    split_index = int(split_ratio * len(X))

    X_train = X[:split_index]
    y_train = y[:split_index]
    X_val = X[split_index:]
    y_val = y[split_index:]
    return X_val,y_val

def spliting_data_val(data):
    steps = 5

    z = []
    for i in range(steps, len(data)):
        z.append(data[i+1 - steps:i+1])

    z = np.array(z)
    return z

@app.route("/longhistory/<script>/<period>/<time>",methods=["GET"])
def longinterval(script,period,time):
    downloads_path = str(Path.home() / "Downloads")
    path = r"{}\{}.csv".format(downloads_path,script)
    jsonpath = r"{}\{}.json".format(downloads_path,script)
    
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(download, script,period,time)
        result = future.result()
 
    df = pd.DataFrame(result)
    df['Growth'] = df['Close'].pct_change() * 100
    df['Growth'] = df['Growth'].round(2)
    df['COV'] = df['Volume'].pct_change()*100
    df['COV'] = df['COV'].round(2)
    df = df.iloc[1:]
    df['COV'] = np.where(np.isinf(df['COV']), 0, df['COV'])
    df['COV'] = np.where(np.isnan(df['COV']), 0, df['COV'])
    df.to_csv(path)
    db = pd.read_csv(path)
    data = db.to_dict(orient='records')
    json_data = []
    for row in data:
        json_data.append({ 
            'Date': row['Date'],
            'Open': row['Open'],
            'High':row['High'],
            'Low':row['Low'],
            'Close':row['Close'],
            'Volume':row['Volume'],
            'Growth':row['Growth'],
            'ChangeInVolume':row['COV']
        })
    with open(jsonpath, 'w') as json_file:
        json.dump(json_data, json_file)
    if(os.path.exists(path) and os.path.exists(jsonpath)):
        f = open(jsonpath)
        data = json.load(f)
        f.close()
        data = json.dumps(data)
        compressed_data = gzip.compress(data.encode('utf-8'))

        response = Response(compressed_data, content_type='application/json')
        response.headers['Content-Encoding'] = 'gzip'
        response.headers['Content-Length'] = len(compressed_data)

        os.remove(jsonpath)
        os.remove(path)
        return response
    return jsonify({"Error"})

@app.route("/shorthistory/<script>/<period>/<time>",methods=["GET"])
def shortinterval(script,period,time):
    downloads_path = str(Path.home() / "Downloads")
    path = r"{}\{}.csv".format(downloads_path,script)
    jsonpath = r"{}\{}.json".format(downloads_path,script)
    
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(download, script,period,time)
        result = future.result()

    df = pd.DataFrame(result)
    df.to_csv(path)
    db = pd.read_csv(path)
    data = db.to_dict(orient='records')
    json_data = []
    for row in data:
        json_data.append({ 
            'Date': row['Datetime'],
            'Open': row['Open'],
            'High':row['High'],
            'Low':row['Low'],
            'Close':row['Close'],
            'Volume':row['Volume']
        })
    with open(jsonpath, 'w') as json_file:
        json.dump(json_data, json_file)
    if(os.path.exists(path) and os.path.exists(jsonpath)):
        f = open(jsonpath)
        data = json.load(f)
        f.close()
        data = json.dumps(data)
        compressed_data = gzip.compress(data.encode('utf-8'))

        response = Response(compressed_data, content_type='application/json')
        response.headers['Content-Encoding'] = 'gzip'
        response.headers['Content-Length'] = len(compressed_data)
        os.remove(jsonpath)
        os.remove(path)
        return response
    return jsonify({"Error"})

@app.route("/info/<script>",methods=["GET"])
def information(script):
    x = yf.Ticker(script)
    info = x.info
    data = json.dumps(info)
    compressed_data = gzip.compress(data.encode('utf-8'))

    response = Response(compressed_data, content_type='application/json')
    response.headers['Content-Encoding'] = 'gzip'
    response.headers['Content-Length'] = len(compressed_data)

    return response

@app.route("/rsiPredictions/<script>",methods=['GET'])
def getRSIPredictions(script):
        maxData = download(script,"max",'1d')
        maxData.reset_index(inplace=True) 
        x = get_historical_data(maxData)

        f = open('historical_data.json')
        maxData = json.load(f)
        # maxData = download(script,"max","1d")
        # maxData.reset_index(inplace=True)
        #df = pd.DataFrame(maxData)
        # jsonMaxData = df.to_json(orient='records')

        # data_without_escape = jsonMaxData.replace("\\", "")

        # json_data = json.loads(data_without_escape)
         
        middle = len(maxData) // 2 

        first_half = maxData[:middle]
        second_half = maxData[middle:]

        split_ratio = 0.9
        first_split_index = int(split_ratio * len(first_half))
        second_split_index = int(split_ratio * len(second_half))

        first_train_data = first_half[:first_split_index]
        first_val_data = first_half[first_split_index:]

        second_train_data = second_half[:second_split_index]
        second_val_data = second_half[second_split_index:]

        latest_15_days = second_half[-15:]
        
        first_half_proccesed_data,first_half_RSI = data_processing(first_half)
        second_half_proccesed_data,second_half_RSI = data_processing(second_half)
        latest_15_days_proccesed_data,latest_RSI = data_processing(latest_15_days)
       
        first_split_X_val,first_split_y_val = spliting_data_test(first_half_proccesed_data)
        second_split_X_val,second_split_y_val = spliting_data_test(second_half_proccesed_data)
        latest_15_days_z_val = spliting_data_val(latest_15_days_proccesed_data)

        loaded_model = keras.models.load_model("80P-RSI-5D-10Y-Close.keras") 

        
        first_split_predictions =  loaded_model.predict(first_split_X_val)
        second_split_predictions = loaded_model.predict(second_split_X_val)
        latest_split_predictions = loaded_model.predict(latest_15_days_z_val)
        
        first_split_y_val = np.nan_to_num(first_split_y_val)
        first_split_predictions = np.nan_to_num(first_split_predictions)

        first_r2 = r2_score(first_split_y_val, first_split_predictions) 
        second_r2 = r2_score(second_split_y_val,second_split_predictions) 
        first_mse = mean_squared_error(first_split_y_val, first_split_predictions) 
        second_mse = mean_squared_error(second_split_y_val,second_split_predictions) 

        # first_train_RSI = [[{'RSI': value[0]} for value in inner_list] for inner_list in first_split_X_val]
        # second_train_RSI = [[{'RSI': value[0]} for value in inner_list] for inner_list in second_split_X_val]

        # first_test_RSI = [{'RSI': float(value)} for value in first_split_y_val]
        # second_test_RSI = [{'RSI': float(value)} for value in second_split_y_val]

        first_split_rsi_list=[]
        for i in range(len(first_split_predictions)):
            first_split_rsi_list.append({**first_val_data[i], "RSI": float(first_split_predictions[i])})

        # first_split_rsi_list = [{'RSI': float(value)} for value in first_split_predictions]
        
        second_split_rsi_list=[]
        for i in range(len(second_split_predictions)):
            second_split_rsi_list.append({**second_val_data[i], "RSI": float(second_split_predictions[i])})

        # second_split_rsi_list = [{'RSI': float(value)} for value in second_split_predictions]
        latest_split_rsi_list = [{'RSI': float(value)} for value in latest_split_predictions]
        
        current_date = datetime.now() 
        
        predicted_values = []
        num_iterations = 30
        temp = latest_15_days_z_val.copy()
        for _ in range(num_iterations):
            next_day = current_date + timedelta(days=_)
            formatted_date = next_day.strftime('%Y-%m-%d')
            x_pred = loaded_model.predict(temp)
            predicted_values.append({"Date":formatted_date,"RSI":float(x_pred[0][0])})
            temp[0, :-1, 0] = temp[0, 1:, 0]
            temp[0, -1, 0] = x_pred[0][0]


        #days_30_predicted_rsi_list = [{"Date":,'RSI': value} for value in predicted_values]
        json_30_day_pred = json.dumps(predicted_values)
        json_first_pred = json.dumps(first_split_rsi_list)
        json_second_pred = json.dumps(second_split_rsi_list)   
 
        return jsonify(
            first_split_rsi = first_half_RSI,  
            first_predicted_values = json_first_pred,
            second_split_rsi = second_half_RSI,
            second_split_predictions = json_second_pred,
            latest_30_day_pred = json_30_day_pred,
            fr2 = first_r2,
            sr2 = second_r2,
            fmse = first_mse,
            smse = second_mse
        ) 
 
        
  
@app.route("/autoSector",methods=["GET"])
def autoSector():
    x = yf.Tickers("M&M.NS HEROMOTOCO.NS BHARATFORG.NS MARUTI.NS BAJAJ-AUTO.NS BOSCHLTD.NS TATAMOTORS.NS EICHERMOT.NS TIINDIA.NS ASHOKLEY.NS MRF.NS SONACOMS.NS BALKRISIND.NS TVSMOTOR.NS MOTHERSON.NS")
    a1 = x.tickers["M&M.NS"].info
    a2 = x.tickers["HEROMOTOCO.NS"].info
    a3= x.tickers['BHARATFORG.NS'].info
    a4 = x.tickers["MARUTI.NS"].info
    a5= x.tickers["MOTHERSON.NS"].info
    a6= x.tickers['BAJAJ-AUTO.NS'].info
    a7 = x.tickers["BOSCHLTD.NS"].info
    a8 = x.tickers["TATAMOTORS.NS"].info
    a9= x.tickers['EICHERMOT.NS'].info
    a10 = x.tickers["TIINDIA.NS"].info
    a11 = x.tickers["ASHOKLEY.NS"].info
    a12= x.tickers['MRF.NS'].info
    a13 = x.tickers["SONACOMS.NS"].info
    a14 = x.tickers["BALKRISIND.NS"].info
    a15= x.tickers['TVSMOTOR.NS'].info

    info = [a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,
            a11,a12,a13,a14,a15]
    
    
    return jsonify(info)

@app.route("/bankSector",methods=["GET"])
def bankSector():
    x = yf.Tickers("BANDHANBNK.NS FEDERALBNK.NS INDUSINDBK.NS BANKBARODA.NS PNB.NS HDFCBANK.NS AUBANK.NS AXISBANK.NS SBIN.NS KOTAKBANK.NS IDFCFIRSTB.NS ICICIBANK.NS")
    a1 = x.tickers["BANDHANBNK.NS"].info
    a2 = x.tickers["FEDERALBNK.NS"].info
    a3= x.tickers['BANKBARODA.NS'].info
    a4 = x.tickers["HDFCBANK.NS"].info
    a5= x.tickers["AUBANK.NS"].info
    a6= x.tickers['AXISBANK.NS'].info
    a7 = x.tickers["SBIN.NS"].info
    a8 = x.tickers["KOTAKBANK.NS"].info
    a9= x.tickers['IDFCFIRSTB.NS'].info
    a10 = x.tickers["ICICIBANK.NS"].info

    info = [a1,a2,a3,a4,a5,a6,a7,a8,a9,a10]
    return jsonify(info)

@app.route("/consumerSector",methods=["GET"])
def consumerSector():
    x = yf.Tickers("ORIENTELEC.NS TTKPRESTIG.NS AMBER.NS RELAXO.NS WHIRLPOOL.NS TITAN.NS RAJESHEXPO.NS CROMPTON.NS DIXON.NS BATAINDIA.NS VGUARD.NS BLUESTARCO.NS VOLTAS.NS HAVELLS.NS KAJARIACER.NS")
    a1 = x.tickers["ORIENTELEC.NS"].info
    a2 = x.tickers["TTKPRESTIG.NS"].info
    a3= x.tickers['AMBER.NS'].info
    a4 = x.tickers["RELAXO.NS"].info
    a5= x.tickers["WHIRLPOOL.NS"].info
    a6= x.tickers['TITAN.NS'].info
    a7 = x.tickers["RAJESHEXPO.NS"].info
    a8 = x.tickers["CROMPTON.NS"].info
    a9= x.tickers['DIXON.NS'].info
    a10 = x.tickers["BATAINDIA.NS"].info
    a11 = x.tickers["VGUARD.NS"].info
    a12= x.tickers['BLUESTARCO.NS'].info
    a13 = x.tickers["VOLTAS.NS"].info
    a14 = x.tickers["HAVELLS.NS"].info
    a15= x.tickers['KAJARIACER.NS'].info

    info = [a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,
            a11,a12,a13,a14,a15]
    return jsonify(info)


@app.route("/energySector",methods=["GET"])
def energySector():
    x = yf.Tickers("TATAPOWER.NS POWERGRID.NS COALINDIA.NS ONGC.NS RELIANCE.NS IOC.NS NTPC.NS BPCL.NS ADANIGREEN.NS ADANITRANS.NS")
    a1 = x.tickers["TATAPOWER.NS"].info
    a2 = x.tickers["POWERGRID.NS"].info
    a3= x.tickers['COALINDIA.NS'].info
    a4 = x.tickers["ONGC.NS"].info
    a5= x.tickers["NTPC.NS"].info
    a6= x.tickers['IOC.NS'].info
    a7 = x.tickers["BPCL.NS"].info
    a8 = x.tickers["ADANIGREEN.NS"].info
    a9= x.tickers['ADANITRANS.NS'].info

    info = [a1,a2,a3,a4,a5,a6,a7,a8,a9]
    return jsonify(info)

@app.route("/financeSector",methods=["GET"])
def financeSector():
    x = yf.Tickers("HDFCAMC.NS SHRIRAMFIN.NS HDFC.NS BAJFINANCE.NS HDFCBANK.NS CHOLAFIN.NS AXISBANK.NS SBILIFE.NS ICICIGI.NS BAJAJFINSV.NS IEX.NS SBIN.NS ICICIPRULI.NS KOTAKBANK.NS ICICIBANK.NS MUTHOOTFIN.NS HDFCLIFE.NS SBICARD.NS PFC.NS RECLTD.NS")
    a1 = x.tickers["HDFCAMC.NS"].info
    a2 = x.tickers["SHRIRAMFIN.NS"].info
    a3= x.tickers['HDFC.NS'].info
    a4 = x.tickers["BAJFINANCE.NS"].info
    a5= x.tickers["HDFCBANK.NS"].info
    a6= x.tickers['AXISBANK.NS'].info
    a7 = x.tickers["CHOLAFIN.NS"].info
    a8 = x.tickers["ICICIGI.NS"].info
    a9= x.tickers['SBILIFE.NS'].info
    a10 = x.tickers["BAJAJFINSV.NS"].info
    a11 = x.tickers["IEX.NS"].info
    a12 = x.tickers["SBIN.NS"].info
    a13= x.tickers['ICICIPRULI.NS'].info
    a14 = x.tickers["KOTAKBANK.NS"].info
    a15= x.tickers["ICICIBANK.NS"].info
    a16= x.tickers['MUTHOOTFIN.NS'].info
    a17 = x.tickers["HDFCLIFE.NS"].info
    a18 = x.tickers["SBICARD.NS"].info
    a19= x.tickers['PFC.NS'].info
    a20 = x.tickers["RECLTD.NS"].info

    info = [a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,
            a11,a12,a13,a14,a15,a16,a17,a18,a19,a20]
    return jsonify(info)

@app.route("/fmgcSector",methods=["GET"])
def fmgcSector():
    x = yf.Tickers("EMAMILTD.NS MARICO.NS VBL.NS GODREJCP.NS NESTLEIND.NS BRITANNIA.NS RADICO.NS TATACONSUM.NS HINDUNILVR.NS ITC.NS COLPAL.NS UBL.NS DABUR.NS MCDOWELL-N.NS PGHH.NS")
    a1 = x.tickers["EMAMILTD.NS"].info
    a2 = x.tickers["MARICO.NS"].info
    a3= x.tickers['VBL.NS'].info
    a4 = x.tickers["GODREJCP.NS"].info
    a5= x.tickers["BRITANNIA.NS"].info
    a6= x.tickers['NESTLEIND.NS'].info
    a7 = x.tickers["TATACONSUM.NS"].info
    a8 = x.tickers["HINDUNILVR.NS"].info
    a9= x.tickers['ITC.NS'].info
    a10 = x.tickers["COLPAL.NS"].info
    a11 = x.tickers["UBL.NS"].info
    a12 = x.tickers["DABUR.NS"].info
    a13= x.tickers['MCDOWELL-N.NS'].info
    a14 = x.tickers["PGHH.NS"].info

    info = [a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,
             a11,a12,a13,a14]
    return jsonify(info)

@app.route("/healthSector",methods=["GET"])
def healthSector():
    x = yf.Tickers("BIOCON.NS SUNPHARMA.NS LALPATHLAB.NS METROPOLIS.NS ALKEM.NS LUPIN.NS DRREDDY.NS LAURUSLABS.NS ABBOTINDIA.NS SYNGENE.NS CIPLA.NS GLENMARK.NS ZYDUSLIFE.NS IPCALAB.NS DIVISLAB.NS APOLLOHOSP.NS MAXHEALTH.NS GRANULES.NS AUROPHARMA.NS TORNTPHARM.NS")
    a1 = x.tickers["BIOCON.NS"].info
    a2 = x.tickers["SUNPHARMA.NS"].info
    a3= x.tickers['LALPATHLAB.NS'].info
    a4 = x.tickers["METROPOLIS.NS"].info
    a5= x.tickers["ALKEM.NS"].info
    a6= x.tickers['LUPIN.NS'].info
    a7 = x.tickers["DRREDDY.NS"].info
    a8 = x.tickers["LAURUSLABS.NS"].info
    a9= x.tickers['ABBOTINDIA.NS'].info
    a10 = x.tickers["SYNGENE.NS"].info
    a11 = x.tickers["CIPLA.NS"].info
    a12 = x.tickers["GLENMARK.NS"].info
    a13= x.tickers['ZYDUSLIFE.NS'].info
    a14 = x.tickers["DIVISLAB.NS"].info
    a15= x.tickers["APOLLOHOSP.NS"].info
    a16= x.tickers['IPCALAB.NS'].info
    a17 = x.tickers["MAXHEALTH.NS"].info
    a18 = x.tickers["AUROPHARMA.NS"].info
    a19= x.tickers['TORNTPHARM.NS'].info

    info = [a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,
            a11,a12,a13,a14,a15,a16,a17,a18,a19]
    return jsonify(info)

@app.route("/ITSector",methods=["GET"])
def ITSector():
    x = yf.Tickers("INFY.NS PERSISTENT.NS MPHASIS.NS TCS.NS LTTS.NS TECHM.NS WIPRO.NS LTIM.NS HCLTECH.NS COFORGE.NS")
    a1 = x.tickers["INFY.NS"].info
    a2 = x.tickers["PERSISTENT.NS"].info
    a3= x.tickers['MPHASIS.NS'].info
    a4 = x.tickers["TCS.NS"].info
    a5= x.tickers["LTTS.NS"].info
    a6= x.tickers['TECHM.NS'].info
    a7 = x.tickers["WIPRO.NS"].info
    a8 = x.tickers["HCLTECH.NS"].info
    a9= x.tickers['COFORGE.NS'].info

    info = [a1,a2,a3,a4,a5,a6,a7,a8,a9]
    return jsonify(info)

@app.route("/mediaSector",methods=["GET"])
def mediaSector():
    x = yf.Tickers("NAZARA.NS SUNTV.NS NETWORK18.NS TV18BRDCST.NS ZEEL.NS PVRINOX.NS NAVNETEDUL.NS HATHWAY.NS NDTV.NS DISHTV.NS")
    a1 = x.tickers["NAZARA.NS"].info
    a2 = x.tickers["SUNTV.NS"].info
    a3= x.tickers['NETWORK18.NS'].info
    a4 = x.tickers["TV18BRDCST.NS"].info
    a5= x.tickers["ZEEL.NS"].info
    a6= x.tickers['PVRINOX.NS'].info
    a7 = x.tickers["NAVNETEDUL.NS"].info
    a8 = x.tickers["HATHWAY.NS"].info
    a9= x.tickers['NDTV.NS'].info
    a10= x.tickers['DISHTV.NS'].info

    info = [a1,a2,a3,a4,a5,a6,a7,a8,a9,a10]
    return jsonify(info)

@app.route("/metalSector",methods=["GET"])
def metalSector():
    x = yf.Tickers("JINDALSTEL.NS SAIL.NS TATASTEEL.NS HINDZINC.NS NATIONALUM.NS NMDC.NS RATNAMANI.NS HINDALCO.NS HINDCOPPER.NS JSWSTEEL.NS JSL.NS ADANIENT.NS WELCORP.NS VEDL.NS APLAPOLLO.NS")
    a1 = x.tickers["JINDALSTEL.NS"].info
    a2 = x.tickers["SAIL.NS"].info
    a3= x.tickers['TATASTEEL.NS'].info
    a4 = x.tickers["HINDZINC.NS"].info
    a5= x.tickers["NATIONALUM.NS"].info
    a6= x.tickers['NMDC.NS'].info
    a7 = x.tickers["RATNAMANI.NS"].info
    a8 = x.tickers["HINDALCO.NS"].info
    a9= x.tickers['HINDCOPPER.NS'].info
    a10 = x.tickers["JSWSTEEL.NS"].info
    a11 = x.tickers["JSL.NS"].info
    a12= x.tickers['ADANIENT.NS'].info
    a13 = x.tickers["WELCORP.NS"].info
    a14= x.tickers["VEDL.NS"].info
    a15= x.tickers['APLAPOLLO.NS'].info

    info = [a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,
            a11,a12,a13,a14,a15]
    return jsonify(info)

@app.route("/oilgasSector",methods=["GET"])
def oilgasSector():
    x = yf.Tickers("HINDPETRO.NS MGL.NS GAIL.NS ONGC.NS PETRONET.NS RELIANCE.NS OIL.NS IOC.NS ATGL.NS AEGISCHEM.NS BPCL.NS GUJGASLTD.NS IGL.NS GSPL.NS CASTROLIND.NS")
    a1 = x.tickers["HINDPETRO.NS"].info
    a2 = x.tickers["MGL.NS"].info
    a4 = x.tickers["GAIL.NS"].info
    a5= x.tickers["ONGC.NS"].info
    a6= x.tickers['PETRONET.NS'].info
    a7 = x.tickers["RELIANCE.NS"].info
    a8 = x.tickers["OIL.NS"].info
    a9= x.tickers['IOC.NS'].info
    a10 = x.tickers["ATGL.NS"].info
    a11 = x.tickers["AEGISCHEM.NS"].info
    a12= x.tickers['BPCL.NS'].info
    a13 = x.tickers["GUJGASLTD.NS"].info
    a14= x.tickers["IGL.NS"].info
    a15= x.tickers['GSPL.NS'].info
    a16 = x.tickers["CASTROLIND.NS"].info

    info = [a1,a2,a4,a5,a6,a7,a8,a9,a10,
            a11,a12,a13,a14,a15,a16]
    return jsonify(info)

@app.route("/pharmaSector",methods=["GET"])
def pharmaSector():
    x = yf.Tickers("BIOCON.NS SUNPHARMA.NS ALKEM.NS GLAXO.NS LUPIN.NS DRREDDY.NS LAURUSLABS.NS ABBOTINDIA.NS CIPLA.NS GLENMARK.NS SANOFI.NS ZYDUSLIFE.NS IPCALAB.NS NATCOPHARM.NS GLAND.NS DIVISLAB.NS GRANULES.NS PFIZER.NS AUROPHARMA.NS TORNTPHARM.NS")
    a1 = x.tickers["BIOCON.NS"].info
    a2 = x.tickers["SUNPHARMA.NS"].info
    a3= x.tickers['ALKEM.NS'].info
    a4 = x.tickers["GLAXO.NS"].info
    a5= x.tickers["LUPIN.NS"].info
    a6= x.tickers['DRREDDY.NS'].info
    a7 = x.tickers["LAURUSLABS.NS"].info
    a8 = x.tickers["ABBOTINDIA.NS"].info
    a9= x.tickers['CIPLA.NS'].info

    a10 = x.tickers["GLENMARK.NS"].info
    a11 = x.tickers["SANOFI.NS"].info
    a12= x.tickers['ZYDUSLIFE.NS'].info
    a13 = x.tickers["IPCALAB.NS"].info
    a14= x.tickers["IPCALAB.NS"].info
    a15= x.tickers['NATCOPHARM.NS'].info
    a16 = x.tickers["GLAND.NS"].info
    a17 = x.tickers["DIVISLAB.NS"].info
    a18= x.tickers['GRANULES.NS'].info

    a19 = x.tickers["PFIZER.NS"].info
    a20 = x.tickers["AUROPHARMA.NS"].info
    a21= x.tickers['TORNTPHARM.NS'].info
    info = [a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,
            a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21]
    return jsonify(info)

@app.route("/privateBankSector",methods=["GET"])
def privateBankSector():
    x = yf.Tickers("BANDHANBNK.NS FEDERALBNK.NS INDUSINDBK.NS RBLBANK.NS CUB.NS HDFCBANK.NS AXISBANK.NS KOTAKBANK.NS IDFCFIRSTB.NS ICICIBANK.NS")
    a1 = x.tickers["BANDHANBNK.NS"].info
    a2 = x.tickers["FEDERALBNK.NS"].info
    a3= x.tickers['INDUSINDBK.NS'].info
    a4 = x.tickers["RBLBANK.NS"].info
    a5= x.tickers["CUB.NS"].info
    a6= x.tickers['HDFCBANK.NS'].info
    a7 = x.tickers["KOTAKBANK.NS"].info
    a8 = x.tickers["AXISBANK.NS"].info
    a9= x.tickers['IDFCFIRSTB.NS'].info
    a10= x.tickers['ICICIBANK.NS'].info

    info = [a1,a2,a3,a4,a5,a6,a7,a8,a9,a10]
    return jsonify(info)

@app.route("/realtySector",methods=["GET"])
def realtySector():
    x = yf.Tickers("LODHA.NS PHOENIXLTD.NS SOBHA.NS DLF.NS IBREALEST.NS OBEROIRLTY.NS PRESTIGE.NS GODREJPROP.NS MAHLIFE.NS BRIGADE.NS")
    a1 = x.tickers["LODHA.NS"].info
    a2 = x.tickers["PHOENIXLTD.NS"].info
    a3= x.tickers['SOBHA.NS'].info
    a4 = x.tickers["DLF.NS"].info
    a5= x.tickers["IBREALEST.NS"].info
    a6= x.tickers['OBEROIRLTY.NS'].info
    a7 = x.tickers["PRESTIGE.NS"].info
    a8 = x.tickers["GODREJPROP.NS"].info
    a9= x.tickers['MAHLIFE.NS'].info
    a10= x.tickers['BRIGADE.NS'].info

    info = [a1,a2,a3,a4,a5,a6,a7,a8,a9,a10]
    return jsonify(info)

@app.route("/nifty50",methods=["GET"])
def nifty50():
    x = yf.Tickers("ADANIENT.NS ADANIPORTS.NS JSWSTEEL.NS TATAMOTORS.NS SUNPHARMA.NS BAJAJ-AUTO.NS NTPC.NS DRREDDY.NS TITAN.NS LT.NS BPCL.NS INDUSINDBK.NS RELIANCE.NS INFY.NS HDFCBANK.NS SBILIFE.NS BAJFINANCE.NS COALINDIA.NS UPL.NS ITC.NS MARUTI.NS BHARTIARTL.NS BRITANNIA.NS TATASTEEL.NS SBIN.NS ULTRACEMCO.NS HINDALCO.NS ASIANPAINT.NS HDFC.NS GRASIM.NS TCS.NS NESTLEIND.NS AXISBANK.NS DIVISLAB.NS HINDUNILVR.NS ONGC.NS EICHERMOT.NS POWERGRID.NS TATACONSUM.NS ICICIBANK.NS CIPLA.NS HCLTECH.NS WIPRO.NS KOTAKBANK.NS BAJAJFINSV.NS M&M.NS APOLLOHOSP.NS HEROMOTOCO.NS TECHM.NS HDFCLIFE.NS")
    a1 = x.tickers["ADANIENT.NS"].info
    a2 = x.tickers["ADANIPORTS.NS"].info
    a3= x.tickers['JSWSTEEL.NS'].info
    a4 = x.tickers["TATAMOTORS.NS"].info
    a5= x.tickers["SUNPHARMA.NS"].info
    a6= x.tickers['BAJAJ-AUTO.NS'].info
    a7 = x.tickers["NTPC.NS"].info
    a8 = x.tickers["DRREDDY.NS"].info
    a9= x.tickers['TITAN.NS'].info
    a10 = x.tickers["LT.NS"].info
    a11 = x.tickers["BPCL.NS"].info
    a12= x.tickers['ICICIBANK.NS'].info
    a13 = x.tickers["INDUSINDBK.NS"].info
    a14 = x.tickers["RELIANCE.NS"].info
    a15= x.tickers['INFY.NS'].info
    a16 = x.tickers["HDFCBANK.NS"].info
    a17 = x.tickers["SBILIFE.NS"].info
    a18= x.tickers['BAJFINANCE.NS'].info
    a19 = x.tickers["COALINDIA.NS"].info
    a20 = x.tickers["UPL.NS"].info
    a21= x.tickers['ITC.NS'].info
    a22 = x.tickers["MARUTI.NS"].info
    a23= x.tickers["BHARTIARTL.NS"].info
    a24= x.tickers['BRITANNIA.NS'].info
    a25 = x.tickers["TATASTEEL.NS"].info
    a26 = x.tickers["SBIN.NS"].info
    a27= x.tickers['ULTRACEMCO.NS'].info
    a28 = x.tickers["HINDALCO.NS"].info
    a29 = x.tickers["ASIANPAINT.NS"].info
    a30= x.tickers['HDFC.NS'].info
    a31 = x.tickers["GRASIM.NS"].info
    a32 = x.tickers["TCS.NS"].info
    a33= x.tickers['NESTLEIND.NS'].info
    a34 = x.tickers["AXISBANK.NS"].info
    a35 = x.tickers["DIVISLAB.NS"].info
    a36= x.tickers['HINDUNILVR.NS'].info
    a37= x.tickers['ONGC.NS'].info
    a38 = x.tickers["EICHERMOT.NS"].info
    a39 = x.tickers["POWERGRID.NS"].info
    a40= x.tickers['TATACONSUM.NS'].info
    a41 = x.tickers["CIPLA.NS"].info
    a42 = x.tickers["HCLTECH.NS"].info
    a43= x.tickers['WIPRO.NS'].info
    a44 = x.tickers["KOTAKBANK.NS"].info
    a45 = x.tickers["BAJAJFINSV.NS"].info
    a46= x.tickers['M&M.NS'].info
    a47 = x.tickers["APOLLOHOSP.NS"].info
    a48= x.tickers['HEROMOTOCO.NS'].info
    a49 = x.tickers["TECHM.NS"].info
    a50 = x.tickers["HDFCLIFE.NS"].info

    info = [a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,
            a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,
            a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,
            a31,a32,a33,a34,a35,a36,a37,a38,a39,a40,
            a41,a42,a43,a44,a45,a46,a47,a48,a49,a50]
    return jsonify(info)

@app.route("/news/<script>",methods=["GET"])
def news(script):
    x = yf.Ticker(script)
    return jsonify(x.news)

@app.route("/suggestion/<script>",methods=["GET"])
def recommendations(script):
    x = yf.Ticker(script)
    return jsonify(x.analyst_price_target)

@app.route("/growth/<script>/<period>/<time>",methods=["GET"])
def growth(script,period,time):
    downloads_path = str(Path.home() / "Downloads")
    path = r"{}\{}.csv".format(downloads_path,script)
    jsonpath = r"{}\{}.json".format(downloads_path,script)

    # index_path = r"{}\{}.csv".format(downloads_path,index)
    # index_jsonpath = r"{}\{}.json".format(downloads_path,index)
    
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(download, script,period,time)
        result = future.result()
    
    # with concurrent.futures.ThreadPoolExecutor() as executor:
    #     future = executor.submit(download, index,period,time)
    #     index_result = future.result()
    df = pd.DataFrame(result)
    # index_df = pd.DataFrame(index_result)
    df['Growth'] = df['Close'].pct_change() * 100
    df['Growth'] = df['Growth'].round(2)
    df['COV'] = df['Volume'].pct_change()*100
    df['COV'] = df['COV'].round(2)
    # index_df['PriceChange'] = index_df['Close'].pct_change() * 100
    # index_df['PriceChange'] = index_df['PriceChange'].round(2)
    # merged_df = pd.merge(df, index_df, on='Date', suffixes=('Stock', 'Index'))
    # merged_df['RS_Rating'] = (merged_df['PriceChange_Stock'] / merged_df['PriceChange_Index']) * 100
    # merged_df['RS_Rating'] = (merged_df['RS_Rating'] - merged_df['RS_Rating'].min()) / (merged_df['RS_Rating'].max() - merged_df['RS_Rating'].min()) * 100
    # return pd.DataFrame(merged_df)

    df.to_csv(path)
    db = pd.read_csv(path)
    data = db.to_dict(orient='records')
    json_data = []
    for row in data:
        json_data.append({ 
            'Date': row['Date'],
            'Open': row['Open'],
            'High':row['High'],
            'Low':row['Low'],
            'Close':row['Close'],
            'Volume':row['Volume'],
            'Growth':row['Growth'],
            'ChangeInVolume':row['COV']
        })
    with open(jsonpath, 'w') as json_file:
        json.dump(json_data, json_file)
    if(os.path.exists(path) and os.path.exists(jsonpath)):
        f = open(jsonpath)
        data = json.load(f)
        f.close()
        os.remove(jsonpath)
        os.remove(path)
        return jsonify(data)
    return jsonify({"Error"})

@app.route("/multipleScript/<script>/<period>/<time>",methods=["GET"])
def multipleScript(script,period,time):
    downloads_path = str(Path.home() / "Downloads")
    path = r"{}\{}.csv".format(downloads_path,script)
    jsonpath = r"{}\{}.json".format(downloads_path,script)

    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(nifty50,period,time)
        result = future.result()
    
   
    df = pd.DataFrame(result)
   
    df.to_csv(path)
    db = pd.read_csv(path)
    data = db.to_dict(orient='records')
    json_data = []
    for row in data:
        json_data.append({ 
            'Date': row['Date'],
            'Open': row['Open'],
            'High':row['High'],
            'Low':row['Low'],
            'Close':row['Close'],
            'Volume':row['Volume'],
            'Growth':row['Growth'],
            'ChangeInVolume':row['COV']
        })

    
    with open(jsonpath, 'w') as json_file:
        json.dump(json_data, json_file)
    if(os.path.exists(path) and os.path.exists(jsonpath)):
        f = open(jsonpath)
        data = json.load(f)
        f.close()
        os.remove(jsonpath)
        os.remove(path)
        return jsonify(data)
    return jsonify({"Error"})
    
def csv_to_json(csv_file_path):
    df = pd.read_csv(csv_file_path)
    data = [{"label": value+".BO"} for value in df.iloc[:, 1]]

    json_data = json.dumps(data, ensure_ascii=False)
    return json_data

@app.route("/hiddenMarkovTest/<script>/<period>/<time>",methods=["GET"])
def hiddenMarkovTest(script,period,time):
    downloads_path = str(Path.home() / "Downloads")
    
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(download, script,period,time)
        result = future.result()
    
    df = pd.DataFrame(result)
    df['Growth'] = df['Close'].pct_change() * 100
    df['Growth'] = df['Growth'].round(2)
    df['COV'] = df['Volume'].pct_change()*100
    df['COV'] = df['COV'].round(2)

    positive_growth = df[df['Growth'] > 0]['Growth']
    mean_positive_growth = positive_growth.mean()
    std_positive_growth = positive_growth.std()

    negative_growth = df[df['Growth'] < 0]['Growth']
    mean_negative_growth = negative_growth.mean()
    std_negative_growth = negative_growth.std()

    return jsonify({
        "P Mean (G)":mean_positive_growth,
        "P SD (G)":std_positive_growth,
        "N Mean (G)":mean_negative_growth,
        "N SD (G)" : std_negative_growth
    })

@app.route("/allStocks",methods=["GET"])
def getAll():
    csv_file_path = 'Equity.csv'
    json_data = csv_to_json(csv_file_path)
    parsed_data = json.loads(json_data)
    return jsonify(parsed_data)

@app.route("/price/<script>",methods=["GET"])
def price(script):
    x = yf.Ticker(script)
    return jsonify({
            "price":x.info['currentPrice'],
        })

data_cache = {}
CACHE_EXPIRATION_SECONDS = 3600

def check_cache_expiration():
    current_time = time.time()
    expired_keys = []
    for symbol, cache_data in data_cache.items():
        timestamp = cache_data.get("timestamp", 0)
        if current_time - timestamp > CACHE_EXPIRATION_SECONDS:
            expired_keys.append(symbol)
    for key in expired_keys:
        data_cache.pop(key)

def process_api(symbols):
    current_time = time.time()
    loc_data = {}
    for symbol in symbols:
        if symbol in data_cache:
            loc_data[symbol] = data_cache[symbol]["data"]
        else:
            ticker = yf.Ticker(symbol)
            sector = ticker.info.get('sector', 'N/A')
            previousClose = ticker.info.get('previousClose', 'N/A')
            open_price = ticker.info.get('open', 'N/A')
            dayLow = ticker.info.get('dayLow', 'N/A')
            dayHigh = ticker.info.get('dayHigh', 'N/A')
            beta = ticker.info.get('beta', 'N/A')
            volume = ticker.info.get('volume', 'N/A')
            exchange = ticker.info.get('exchange', 'N/A')
            shortName = ticker.info.get('shortName', 'N/A')
            currentPrice = ticker.info.get('currentPrice', 'N/A')
            marketCap = ticker.info.get('marketCap','N/A')
            forwardPE = ticker.info.get('forwardPE','N/A')
            forwardEps = ticker.info.get('forwardEps','N/A')
            totalRevenue = ticker.info.get('totalRevenue','N/A')
            trailingEps = ticker.info.get('trailingEps','N/A')
            trailingPE = ticker.info.get('trailingPE','N/A')
            loc_data[symbol] = {
                "Name":shortName,
                "Price":currentPrice,
                "Open":open_price,
                "High":dayHigh,
                "Low":dayLow,
                "Close":previousClose,
                "Volume":volume,
                "Beta":beta,
                "Exchange":exchange,
                "Sector":sector,
                "Cap":marketCap,
                "forwardPE":forwardPE,
                "forwardEps":forwardEps,
                "totalRevenue":totalRevenue,
                "trailingEps":trailingEps,
                "trailingPE":trailingPE
            }
            data_cache[symbol] = {
                "data": loc_data[symbol],
                "timestamp": current_time
            }
    check_cache_expiration()
    return loc_data

#  x = yf.Tickers("ADANIENT.NS ADANIPORTS.NS JSWSTEEL.NS TATAMOTORS.NS SUNPHARMA.NS BAJAJ-AUTO.NS NTPC.NS DRREDDY.NS TITAN.NS LT.NS BPCL.NS INDUSINDBK.NS RELIANCE.NS INFY.NS HDFCBANK.NS SBILIFE.NS BAJFINANCE.NS COALINDIA.NS UPL.NS ITC.NS MARUTI.NS BHARTIARTL.NS BRITANNIA.NS TATASTEEL.NS SBIN.NS ULTRACEMCO.NS HINDALCO.NS ASIANPAINT.NS HDFC.NS GRASIM.NS TCS.NS NESTLEIND.NS AXISBANK.NS DIVISLAB.NS HINDUNILVR.NS ONGC.NS EICHERMOT.NS POWERGRID.NS TATACONSUM.NS ICICIBANK.NS CIPLA.NS HCLTECH.NS WIPRO.NS KOTAKBANK.NS BAJAJFINSV.NS M&M.NS APOLLOHOSP.NS HEROMOTOCO.NS TECHM.NS HDFCLIFE.NS")
#     a1 = x.tickers["ADANIENT.NS"].info

@app.route("/getAllInfoNSE",methods=["GET"])
def getAllInfoNSE():
    try:
        csv_file_name = "NSEEquity.csv"
        df = pd.read_csv(csv_file_name)
        data = [value+".NS" for value in df.iloc[:, 0]]

        batch_size = 100  # Adjust the batch size as needed
        data_batches = [data[i:i + batch_size] for i in range(0, len(data), batch_size)]

        with ThreadPoolExecutor() as executor:
            # Using `submit` to submit the tasks to the executor
            futures = {executor.submit(process_api, batch) for batch in data_batches}

            # Dictionary to store the results
            results = {}

            # Extract the results as they become available
            for future in futures:
                try:
                    result = future.result()
                    results.update(result)
                except Exception as e:
                    print(f"Error in processing batch: {e}")
            
        json_data = json.dumps(results)

        # Compress the JSON data using gzip
        compressed_data = gzip.compress(json_data.encode('utf-8'))

        # Set the appropriate headers for gzip response
        response = Response(compressed_data, content_type='application/json')
        response.headers['Content-Encoding'] = 'gzip'
        response.headers['Content-Length'] = len(compressed_data)
        
        return response
    except Exception as e:
        return str(e), 500 

data_cache_BSE = {}

def check_cache_expiration_BSE():
    current_time = time.time()
    expired_keys = []
    for symbol, cache_data in data_cache_BSE.items():
        timestamp = cache_data.get("timestamp", 0)
        if current_time - timestamp > CACHE_EXPIRATION_SECONDS:
            expired_keys.append(symbol)
    for key in expired_keys:
        data_cache_BSE.pop(key)

def process_api_BSE(symbols):
    current_time = time.time()
    loc_data = {}
    for symbol in symbols:
        if symbol in data_cache_BSE:
            loc_data[symbol] = data_cache_BSE[symbol]["data"]
        else:
            ticker = yf.Ticker(symbol)
            sector = ticker.info.get('sector', 'N/A')
            previousClose = ticker.info.get('previousClose', 'N/A')
            open_price = ticker.info.get('open', 'N/A')
            dayLow = ticker.info.get('dayLow', 'N/A')
            dayHigh = ticker.info.get('dayHigh', 'N/A')
            beta = ticker.info.get('beta', 'N/A')
            volume = ticker.info.get('volume', 'N/A')
            exchange = ticker.info.get('exchange', 'N/A')
            shortName = ticker.info.get('shortName', 'N/A')
            currentPrice = ticker.info.get('currentPrice', 'N/A')
            marketCap = ticker.info.get('marketCap','N/A')
            forwardPE = ticker.info.get('forwardPE','N/A')
            forwardEps = ticker.info.get('forwardEps','N/A')
            totalRevenue = ticker.info.get('totalRevenue','N/A')
            trailingEps = ticker.info.get('trailingEps','N/A')
            trailingPE = ticker.info.get('trailingPE','N/A')
            loc_data[symbol] = {
                "Name":shortName,
                "Price":currentPrice,
                "Open":open_price,
                "High":dayHigh,
                "Low":dayLow,
                "Close":previousClose,
                "Volume":volume,
                "Beta":beta,
                "Exchange":exchange,
                "Sector":sector,
                "Cap":marketCap,
                "forwardPE":forwardPE,
                "forwardEps":forwardEps,
                "totalRevenue":totalRevenue,
                "trailingEps":trailingEps,
                "trailingPE":trailingPE
            }
            data_cache_BSE[symbol] = {
                "data": loc_data[symbol],
                "timestamp": current_time
            }
    check_cache_expiration_BSE()
    return loc_data


@app.route("/getAllInfoBSE",methods=["GET"])
def getAllInfoBSE():
    try:
        csv_file_name = "Equity.csv"
        df = pd.read_csv(csv_file_name)
        data = [value+".BO" for value in df.iloc[:, 1]]

        batch_size = 100  # Adjust the batch size as needed
        data_batches = [data[i:i + batch_size] for i in range(0, len(data), batch_size)]

        with ThreadPoolExecutor() as executor:
            # Using `submit` to submit the tasks to the executor
            futures = {executor.submit(process_api_BSE, batch) for batch in data_batches}

            # Dictionary to store the results
            results = {}

            # Extract the results as they become available
            for future in futures:
                try:
                    result = future.result()
                    results.update(result)
                except Exception as e:
                    print(f"Error: {str(e)}")
                    
            
        json_data = json.dumps(results)

        # Compress the JSON data using gzip
        compressed_data = gzip.compress(json_data.encode('utf-8'))

        # Set the appropriate headers for gzip response
        response = Response(compressed_data, content_type='application/json')
        response.headers['Content-Encoding'] = 'gzip'
        response.headers['Content-Length'] = len(compressed_data)
        
        return response
    except Exception as e:
        return str(e), 500 

if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=5000, threads='10')
    # app.run(debug=True)