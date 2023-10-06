from typing import Union
import json
import time
import numpy as np
import pandas as pd
from concurrent.futures import ThreadPoolExecutor
import concurrent.futures
import numpy as np
import gzip
from pathlib import Path
import os.path

import yfinance as yf
import asyncio
from concurrent.futures import ThreadPoolExecutor

from fastapi import FastAPI,Response, HTTPException
from starlette.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.gzip import GZipMiddleware



from pydantic import BaseModel


class LongHistoryModel(BaseModel):
    Date: str
    Open: float
    High: float
    Low: float 
    Close : float
    Volume : int
    Growth : float
    ChangeInVolume : float



app = FastAPI()

app.add_middleware(GZipMiddleware, minimum_size=1000)

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def download(script,period,time):
    try:
        x = yf.download(tickers = script, 
            period = period,         
            interval = time,       
            prepost = False,       
            repair = True)
        return x
    except Exception as e:
        print("Error in download_data:", str(e))
        raise


@app.get("/longhistory/{script}/{period}/{time}")
def longinterval(script:str,period:str,time:str) ->JSONResponse:
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
            # compressed_data = gzip.compress(data.encode('utf-8'))

            # response = Response(compressed_data, content_type='application/json')
            # response.headers['Content-Encoding'] = 'gzip'
            # response.headers['Content-Length'] = len(compressed_data)

            os.remove(jsonpath)
            os.remove(path)
            return JSONResponse(content=data)
        return 
