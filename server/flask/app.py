from flask import Flask,jsonify,request,send_file
import requests
from flask_cors import CORS
import logging
import json
import time
import numpy as np
import pandas as pd
from selenium.webdriver.support.ui import WebDriverWait
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from pathlib import Path
import os.path
from selenium.webdriver.common.by import By
from datetime import datetime
import pytz
import yfinance as yf
import csv
import threading
import concurrent.futures
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import numpy as np

ist_offset = 5.5 * 60 * 60  
ist_tz = pytz.timezone('Asia/Kolkata')
utc_now = datetime.now(pytz.utc)
ist_now = utc_now.astimezone(ist_tz)
ist_now = ist_now.replace(hour=0, minute=0, second=0, microsecond=0)
timestamp = int((ist_now.timestamp() + ist_offset))

app = Flask(__name__)
CORS(app,origins="*")


@app.route("/history",methods=['POST'])
def stockdata():
    if(request.method=="POST"):
        data=None
        script = request.json.get("script")
        downloads_path = str(Path.home() / "Downloads")
        path = r"{}\{}.NS.csv".format(downloads_path,script)
        jsonpath = r"{}\{}.NS.json".format(downloads_path,script)

        if os.path.isfile(path):
            os.remove(path)
            
            driver = webdriver.Chrome('./chromedriver')
            driver.set_window_position(-2000,0)
            driver.minimize_window()
            l= driver.get(f"https://query1.finance.yahoo.com/v7/finance/download/{script}.NS?period1=820454400&period2={timestamp}&interval=1d&events=history&includeAdjustedClose=true")
            
            
            while not os.path.exists(path):
                time.sleep(1)
            driver.close()
            try:
                with open(path):
                    db = pd.read_csv(path)
                    data = db.to_dict(orient='records')
                    json_data = []
                    #final_data = {script:json_data}
                    for row in data:
                        json_data.append({ 
                            'Date': row['Date'],
                            'Open': row['Open'],
                            'High':row['High'],
                            'Low':row['Low'],
                            'Close':row['Close'],
                            'Volume':row['Volume']
                            })
                    with open(jsonpath, 'w') as json_file:
                        json.dump(json_data, json_file)
                    #db.to_json (jsonpath)
                    f = open(jsonpath)
                    jdata = json.load(f)
                    f.close()
                    return jsonify(jdata)
            except IOError:
                logging.exception('')
        else:
            driver = webdriver.Chrome('./chromedriver')
            driver.set_window_position(-2000,0)
            driver.minimize_window()
            l= driver.get(f"https://query1.finance.yahoo.com/v7/finance/download/{script}.NS?period1=820454400&period2={timestamp}&interval=1d&events=history&includeAdjustedClose=true")
            
            
            while not os.path.exists(path):
                time.sleep(1)
            driver.close()

            try:
                with open(path):
                    db = pd.read_csv(path)
                    data = db.to_dict(orient='records')
                    json_data = []
                    #final_data = {script:json_data}
                    for row in data:
                        json_data.append({ 
                            'Date': row['Date'],
                            'Open': row['Open'],
                            'High':row['High'],
                            'Low':row['Low'],
                            'Close':row['Close'],
                            'Volume':row['Volume']
                            })
                    with open(jsonpath, 'w') as json_file:
                        json.dump(json_data, json_file)
                    #db.to_json (jsonpath)
                    #r =requests.post(f"http://localhost:3000/{script}",files=)
                    f = open(jsonpath)
                    jdata = json.load(f)
                    f.close()
                    return jsonify(jdata)
            except IOError:
                logging.exception('')

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
        os.remove(jsonpath)
        os.remove(path)
        return jsonify(data)
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
        os.remove(jsonpath)
        os.remove(path)
        return jsonify(data)
    return jsonify({"Error"})

@app.route("/info/<script>",methods=["GET"])
def information(script):
    x = yf.Ticker(script)
    info = x.info
    return jsonify(info)

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
    data = [value+".NS" for value in df.iloc[:, 0]]

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

@app.route("/stockAnalysisData/<script>/<period>/<time>",methods=["GET"])
def stockAnalysisData(script,period,time):
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
            "Close":row['Close'],
            'Growth':row['Growth'],
            'ChangeInVolume':row['COV']
        })

    lowest_close = min(json_data, key=lambda x: x['Close'])['Close']
    highest_close = max(json_data, key=lambda x: x['Close'])['Close']

    features = ["Close", "Growth", "ChangeInVolume"]
    dataset = []
    for entry in data:
        sample = []
        for feature in features:
            value = entry.get(feature)
            if value is None:
                sample.append(np.nan)  # Replace missing values with NaN
            else:
                sample.append(value)
        dataset.append(sample)
    dataset = np.array(dataset)

    normalized_dataset = dataset.copy()
    for i in range(dataset.shape[1]):
        feature_values = dataset[:, i]
        valid_values = feature_values[~np.isnan(feature_values)]
        if valid_values.size > 0:
            feature_min = np.min(valid_values)
            feature_max = np.max(valid_values)
            normalized_dataset[:, i] = [(value - feature_min) / (feature_max - feature_min) if ~np.isnan(value) else 0 for value in feature_values]
        else:
            normalized_dataset[:, i] = 0
            
    n_steps = 3  

    X = []
    y = []

    for i in range(n_steps, len(data)):
        X.append(normalized_dataset[i - n_steps:i])
        y.append(normalized_dataset[i][0])  

    X = np.array(X)
    y = np.array(y)
  

    
    print("X shape:", X.shape) 
    print("y shape:", y.shape)

    
    
    split_ratio = 0.9 
    split_index = int(split_ratio * len(X))

    X_train = X[:split_index]
    y_train = y[:split_index]
    X_val = X[split_index:]
    y_val = y[split_index:]

    print(X_val.shape)

    model = Sequential()
    model.add(LSTM(64, input_shape=(X.shape[1], X.shape[2])))
    model.add(Dense(1))


    model.compile(optimizer='adam', loss='mse')

    batch_size = 32
    epochs = 30

    model.fit(X_train, y_train, batch_size=batch_size, epochs=epochs, validation_data=(X_val, y_val))

    ###Training the Model

    # y_pred = model.predict(X_val)

    # valid_indices = ~np.isnan(y_pred.flatten()) & ~np.isnan(y_val.flatten())
    # y_pred_valid = y_pred.flatten()[valid_indices]
    # y_val_valid = y_val.flatten()[valid_indices]

    # mse = np.mean(np.square(y_val_valid - y_pred_valid))

    # model.save('patternPredictor.keras')

    loaded_model = keras.models.load_model('patternPredictor.keras')

    # Make predictions using the loaded model
    predictions = loaded_model.predict(X_val)

    min_target = np.min(predictions)
    max_target = np.max(predictions)

    actual_predictions = predictions * (highest_close - lowest_close) + lowest_close
    print(actual_predictions)
    return jsonify({"Prediction" : actual_predictions[0][0]})
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

@app.route("/allStocks",methods=["GET"])
def getAll():
    csv_file_path = 'Realty.csv'
    json_data = csv_to_json(csv_file_path)
    parsed_data = json.loads(json_data)
    return jsonify(parsed_data)

@app.route("/price/<script>",methods=["GET"])
def price(script):
    x = yf.Ticker(script)
    return jsonify({
            "price":x.info['currentPrice'],
        })

if __name__ == "__main__":
    app.run(debug=True)