from flask import Flask,jsonify,request,send_file
import requests
from flask_cors import CORS
import logging
import json
import time
import pandas as pd
from selenium.webdriver.support.ui import WebDriverWait
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from pathlib import Path
import os.path


app = Flask(__name__)
CORS(app)

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
            l= driver.get(f"https://query1.finance.yahoo.com/v7/finance/download/{script}.NS?period1=820454400&period2=1683244800&interval=1d&events=history&includeAdjustedClose=true")
            
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
            l= driver.get(f"https://query1.finance.yahoo.com/v7/finance/download/{script}.NS?period1=820454400&period2=1683244800&interval=1d&events=history&includeAdjustedClose=true")
            
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
        
    

if __name__ == "__main__":
    app.run(debug=True)