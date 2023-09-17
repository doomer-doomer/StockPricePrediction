"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation';
import Link from "next/link";

import './chart.css'

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import Search from '@mui/icons-material/Search'

import stock from './stock';

import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsFullscreen from 'highcharts/modules/full-screen';
import HighchartsMore from 'highcharts/highcharts-more';
import annotations from 'highcharts/modules/annotations';

import theme1 from 'highcharts/themes/avocado';
import theme2 from 'highcharts/themes/brand-dark'
import theme3 from 'highcharts/themes/brand-light'
import theme4 from 'highcharts/themes/dark-blue'
import theme5 from 'highcharts/themes/dark-green'
import theme6 from 'highcharts/themes/dark-unica'
import theme7 from 'highcharts/themes/gray'
import theme8 from 'highcharts/themes/grid'
import theme9 from 'highcharts/themes/grid-light'
import theme10 from 'highcharts/themes/high-contrast-dark'
import theme11 from 'highcharts/themes/high-contrast-light'
import theme12 from 'highcharts/themes/sand-signika'
import theme13 from 'highcharts/themes/skies'
import theme14 from 'highcharts/themes/sunset'

import HighchartsStock from 'highcharts/modules/stock';
import HighchartHollow from 'highcharts/modules/hollowcandlestick'
import Indicators from 'highcharts/indicators/indicators';

import EMA from 'highcharts/indicators/ema';
import pivotpoints from 'highcharts/indicators/pivot-points'
import acceleration from 'highcharts/indicators/acceleration-bands'
import bollinger from 'highcharts/indicators/bollinger-bands';
import DEMA from 'highcharts/indicators/dema'
import ichimoku from 'highcharts/indicators/ichimoku-kinko-hyo'
import keltner from 'highcharts/indicators/keltner-channels'
import linearregression from 'highcharts/indicators/regressions.src'
import pricechannel from 'highcharts/indicators/price-channel'
import envelopes from 'highcharts/indicators/price-envelopes'
import psar from 'highcharts/indicators/psar'
import supertrend from 'highcharts/indicators/supertrend'
import tema from 'highcharts/indicators/tema';
import volumebyprice from 'highcharts/indicators/volume-by-price'
import wma from 'highcharts/indicators/wma'
import vwap from 'highcharts/indicators/vwap'
import zigzag from 'highcharts/indicators/zigzag'
import macd from 'highcharts/indicators/macd'
import momentum from 'highcharts/indicators/momentum'

import abo from 'highcharts/indicators/apo'
import accumdis from 'highcharts/indicators/accumulation-distribution'
import arron from 'highcharts/indicators/aroon'
import arronos from 'highcharts/indicators/aroon-oscillator'
import atr from 'highcharts/indicators/atr'
import awesome from 'highcharts/indicators/ao'
import cci from 'highcharts/indicators/cci'
import chaikin from 'highcharts/indicators/chaikin'
import cmf from 'highcharts/indicators/cmf'
import cmo from 'highcharts/indicators/cmo'
import detrend from 'highcharts/indicators/dpo'
import di from 'highcharts/indicators/disparity-index'
import dmi from 'highcharts/indicators/dmi'
import klinger from 'highcharts/indicators/klinger'
import mfi from 'highcharts/indicators/mfi'
import rsi from 'highcharts/indicators/rsi'
//import slowstoch from 'highcharts/indicators/slow-stochastic'
import stoch from 'highcharts/indicators/stochastic'

import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
// import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Navbar, Button, Text, Card, Radio, theme } from "@nextui-org/react";
import { Grid, Switch } from "@nextui-org/react";
import { SunIcon } from './sun';
import { MoonIcon } from './moon';
import { Dropdown,DropdownItem  } from "@nextui-org/react";
import { NextUIProvider } from '@nextui-org/react';
import { createTheme } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useTheme as useNextTheme } from 'next-themes'

theme12(Highcharts)

HighchartsStock(Highcharts);
HighchartHollow(Highcharts)
HighchartsExporting(Highcharts)
HighchartsFullscreen(Highcharts)
HighchartsMore(Highcharts)
annotations(Highcharts);

Indicators(Highcharts)
arron(Highcharts)
arronos(Highcharts)
pivotpoints(Highcharts)
atr(Highcharts)
awesome(Highcharts)
cci(Highcharts)
chaikin(Highcharts)
cmf(Highcharts)
cmo(Highcharts)
detrend(Highcharts)
di(Highcharts)
dmi(Highcharts)
klinger(Highcharts)
mfi(Highcharts)
rsi(Highcharts)
//slowstoch(Highcharts)
stoch(Highcharts)
//trix(Highcharts)
abo(Highcharts)
accumdis(Highcharts)

momentum(Highcharts)
EMA(Highcharts)
acceleration(Highcharts)
bollinger(Highcharts)
DEMA(Highcharts)
ichimoku(Highcharts)
keltner(Highcharts)
linearregression(Highcharts)
pricechannel(Highcharts)
envelopes(Highcharts)
psar(Highcharts)
supertrend(Highcharts)
tema(Highcharts)
volumebyprice(Highcharts)
wma(Highcharts)
vwap(Highcharts)
zigzag(Highcharts)
macd(Highcharts)

const lightTheme = createTheme({
  type: 'light',
  
  
  
})

const darkTheme = createTheme({
  type: 'dark',
 
  
})

export default function Chart(){
  const [script,setscript]=useState("");
  const [isDark, setIsDark] = useState(false);
  const [testtheme, testsetTheme] = useState('light');
  
    const pathname = usePathname();
    const router = useRouter();
    const [theme,settheme] = useState(theme11(Highcharts))
    const [optionTheme,setoptionTheme] = useState({
      backgroundColor:"#000000",
      color:"#ffffff"
    })
    const testchart = React.useRef(null)
    const [cursor,setcursor]=useState({
      x:"",
      y:""
    })
    const [scriptData,setscriptData]=useState({
        prev:"",
        open:"",
        volume:"",
        cap:"",
        pe:"",
        high:"",
        low:"",
        fiftytwo:"",
        range:""
    })
    const [alldata,setalldata]=useState([])
    const [separatechart,setseparatechart]=useState(alldata)
    const [price,setprice] = useState("");
    const [load,setload]=useState(false);

    const date = new Date()
    let currdate = date.toJSON()

    const [lines, setLines] = useState([]);

    const heikinAshiData = separatechart.reduce((result, obj) => {
        const prevData = result[result.length - 1] || [new Date(obj.Date).getTime(), obj.Open, obj.High, obj.Low, obj.Close];
        const heikinAshiOpen = (prevData[1] + prevData[4]) / 2;
        const heikinAshiClose = (obj.Open+ obj.High+obj.Low+ obj.Close) / 4;
        const heikinAshiHigh = Math.max(obj.High, heikinAshiOpen, heikinAshiClose);
        const heikinAshiLow = Math.min(obj.Low, heikinAshiOpen, heikinAshiClose);
        return [...result, [new Date(obj.Date).getTime(), heikinAshiOpen, heikinAshiHigh, heikinAshiLow, heikinAshiClose]];
      }, []);

      function printMousePos(event) {
          const point =testcandlestick.series[0].data[0];
          const xCoordinate = point.plotX;
          const yCoordinate = point.plotY
          const updatedOptions = { ...testcandlestick }; // Create a shallow copy of the options object
          updatedOptions.yAxis[0].plotLines[0].value = event.yAxis[0].value; // Update the value property
          updatedOptions.yAxis[0].plotLines[0].color = "blue"
          setcandlestick(updatedOptions);
      }

      function printMousePos2(event) {
        const point =testcandlestick.series[0].data[0];
        const xCoordinate = point.plotX;
        const yCoordinate = point.plotY
        const updatedOptions = { ...testcandlestick }; // Create a shallow copy of the options object
        updatedOptions.xAxis[0].plotLines[0].value = event.xAxis[0].value; // Update the value property
        updatedOptions.xAxis[0].plotLines[0].color = "blue"
        setcandlestick(updatedOptions);
    }
    const [coordinates,setcords] = useState([]);

function handleClick(event) {
  const point =testcandlestick.series[0].data[0];
  const xCoordinate = point.plotX;
  const yCoordinate = point.plotY
  const updatedOptions = { ...testcandlestick };
  updatedOptions.series[2].data[0].value = event.xAxis[0].value;
  updatedOptions.series[2].data[0].value =event.yAxis[0].value;
 
  setcandlestick(updatedOptions);
}
      
const [ChartMainType,setChartMainType] = useState("candlestick");
const [firstOverlay,firstsetOverlay] =useState("ema")
const [firstOss,setfirstOss] = useState("rsi")
const [secOss,setsecOss] = useState("macd")

const initialLoadCount = 100; 
const [displayedItems, setDisplayedItems] = useState(stock.slice(0, initialLoadCount));
  const itemsPerPage = 100; // Number of items to load per page
  

const handleChange = (e,value)=>{
  //e.preventDefault();
  setscript(value)
  console.log(value)
  router.push(`/stocks/${value}`)
}

const travel = (e)=>{

  router.push(`/stocks/chart/${e}`)
}
      const candlestick ={
        chart:{
          type:"line",
          style: {
            backgroundColor:isDark ? "#16181A" : "#FFFFFF",
            fontFamily:"Segoe UI",
          },
          
          
        },
        title:{
          style: {
            color: isDark ? "#16181A" : "#FFFFFF",
          },
        },
        loading:{
          hideDuration:"1000",
          showDuration:"1000"
        },
        legend:{
          enabled:false,
          align: 'right',
          verticalAlign: 'top',
          floating: true, 
          backgroundColor: isDark ? "#16181A" : "#FFFFFF",   
          itemStyle: {
            color: isDark ? "#FFFFFF" : "#16181A"
          }
     },
        navigator: {
          enabled: false
        },
        exporting: {
          enabled: false, 
          chartOptions: {
            chart: {
              events: {
                load: function () {
                  this.container.querySelector('.highcharts-button').style.display =
                    'none'; 
                },
              },
            },
          },
          buttons: {
            contextButton: {
              menuItems: ['fullscreen'],
            },
          },
        },
        plotOptions: {
          series: {
            cursor: 'pointer', // Show the zoom-in cursor when hovering over the plot area
          },
        },
        scrollablePlotArea: {
          minWidth: 700, // Minimum width before scrolling is enabled
          scrollPositionX: 1, // Initial scroll position (percentage of plot area)
        },
        rangeSelector: {
          buttonTheme: {
            fill: isDark ? "#FFFFFF" : "#16181A",
                stroke: 'none',
                'stroke-width': 0,
                r: 8,
                style: {
                    color: isDark ? "#16181A" : "#ECEDEE",
                    fontWeight: 'bold'
                },
                states: {
                    hover: {
                      fill: isDark ? "#16181A" : "#ECEDEE",
                        style: {
                            color: isDark ? "#FFFFFF" : "#16181A"
                        }
                    },
                    select: {
                        fill: isDark ? "#16181A" : "#ECEDEE",
                        style: {
                            color: isDark ? "#FFFFFF" : "#16181A"
                        }
                    }
                    // disabled: { ... }
                }
            },
            labelStyle: {
              color: isDark ? "#ECEDEE" : "#16181A",
              fontWeight: 'bold'
          },
          verticalAlign: 'bottom',
          inputPosition: {
            align: 'left',
            x: 0,
            y: 0
        },
        buttonPosition: {
            align: 'right',
            x: 0,
            y: 0
        },
        selected:null,
        buttons: [{
          type: 'hour',
          count: 1,
          text: '1h'
      }, {
          type: 'hour',
          count: 3,
          text: '3h'
      }, {
          type: 'day',
          count: 1,
          text: '1D'
      }, {
        type: 'week',
        count: 1,
        text: '1W'
    },{
        type: 'month',
        count: 1,
        text: '1M'
      },{
        type: 'month',
        count: 3,
        text: '3M'
      },
      {
        type: 'month',
        count: 6,
        text: '6M'
      },{
        type: 'ytd',
        text: 'YTD'
    }, {
        type: 'year',
        count: 1,
        text: '1y'
    },  {
          type: 'all',
          count: 1,
          text: 'All'
      }],
      },
      responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                chart: {
                    
                },
                subtitle: {
                    text: null
                },
                navigator: {
                    enabled: false
                }
            }
        }]
    },
    
      series: [
        {
          type: ChartMainType,
          name: pathname.slice(14,),
          id: "static",
          data: [...separatechart.map(obj=>
            [new Date(obj.Date).getTime(),obj.Open,obj.High,obj.Low,obj.Close]
          ),[new Date(currdate.slice(0,10)).getTime(),parseFloat((scriptData.open).split(',').join("")),scriptData.high,scriptData.low,parseFloat(price.split(',').join(""))]],
          color:"red",
          upColor:"#17C964",
          yAxis:0,
          fillOpacity: 1, 
        },
      {
        type:"column",
        id: 'volume',
        name: 'Volume',
        data: [...separatechart.map(obj=>
          [new Date(obj.Date).getTime(),obj.Volume]
        ),[new Date(currdate.slice(0,10)).getTime(),parseFloat(scriptData.volume.split(',').join(""))]],
        yAxis: 1,
        tooltip: {
          valueDecimals: 2, 
        },
        opacity: 0.5
      },
      
      
      {
        type:firstOverlay,
        linkedTo:"static",
        showInLegend: true,
        color: '#0952A5',
        parems:{
          period:"14"
        },
        yAxis:0,
      },
      {
        type:firstOss,
        linkedTo:"static",
        color: '#06B7DB',
        showInLegend: true,
        parems:{
          period:"14"
        },
        yAxis:2,
      },
      {
        type:secOss,
        linkedTo:"static",
        color: '#A66908',
        showInLegend: true,
        parems:{
          period:"14"
        },
        yAxis:3,
      },
      // {
      //   type:indicator1,
      //   linkedTo:"static",
      //   parems:{
      //     period:14
      //   },
      //   yAxis:0
      // },
      // {
      //   type:indicator2,
      //   linkedTo:"static",
      //   parems:{
      //     period:14
      //   },
      //   yAxis:2
      // },
      // {
      //   type:indicator3,
      //   linkedTo:"static",
      //   parems:{
      //     period:14
      //   },
      //   yAxis:3
      // }
      //overlayIndicators,
      //oscillationsIndicators
    
      //Overlay
    
      // {
      //   type: 'pc',
      //   linkedTo: static
    
      // }, 
      // {
      //   type: 'priceenvelopes',
      //   linkedTo: static
      // },
      // {
      //   type: 'vbp',
      //   linkedTo: static,
      //   showInLegend: true
      // }
      // {
      //   type: 'sma',
      //   linkedTo: static, 
      //   params: {
      //     period: 10
      //   },
      // },
      
      // {
      //   type: 'linearRegression',
      //   linkedTo: static,
      //   zIndex: -1,
      //   params: {
      //       period: 5
      //   },
      // },
      // {
      //   type: 'ema',
      //   linkedTo: static, 
      //   params: {
      //     period: 14
      //   },
      //   yAxis:0
      // },
      // {
      //   type: 'dema',
      //   linkedTo: static, 
      //   params: {
      //     period: 9
      //   },
      // },
      // {
      //   type: 'tema',
      //   linkedTo: static, 
      //   params: {
      //     period: 12
      //   },
      // },
      // {
      //   type: 'psar',
      //   linkedTo: static, 
        
      // },
      // {
      //   type: 'zigzag',
      //   linkedTo: static, 
        
      // },
      // {
      //   type: 'wma',
      //   linkedTo: static, 
        
      // },
    
    
      //Separate
    //   {
    //     type: 'macd',
    //     linkedTo: static, 
    //     yAxis:2
        
    //   },
    //   {
    //     type: 'momentum',
    //     linkedTo: static, 
    //     yAxis:2
    //   },
    //   {
    //     type: 'apo',
    //     linkedTo: static,
    //     yAxis: 1,
    //     color: 'grey',
    //     lineWidth: 2,
    //     params: {
    //         periods: [10, 20]
    //     },
    //     yAxis:2
    //   },
    //   {
    //     type: 'ad',
    //     linkedTo: static,
    //     yAxis: 3,
    //     params: {
    //         period: 0,
    //         volumeSeriesID: 'volume'
    //     }
    //   },
    //   {
    //     yAxis: 2,
    //     type: 'aroon',
    //     linkedTo: static,
    //     color: 'green',
    //     lineWidth: 1,
    //     aroonDown: {
    //         styles: {
    //             lineColor: 'red'
    //         }
    //     },
    //     params: {
    //         period: 25
    //     }
    // },
    // , {
    //   type: 'aroonoscillator',
    //   linkedTo: static,
    //   yAxis: 2,
    //   color: 'turquoise',
    //   lineWidth: 1.5,
    //   style: {
    //       lineWidth: 5
    //   },
    //   params: {
    //       period: 14
    //   }
    // },
    // {
    //   type: 'atr',
    //   linkedTo: static,
    //   yAxis: 1
    // },
    // , {
    //   type: 'ao',
    //   yAxis: 2,
    //   greaterBarColor: '#00cc66',
    //   lowerBarColor: '#FF5E5E',
    //   linkedTo: static,
    //   showInLegend: true
    // },
    // , {
    //   type: 'cci',
    //   linkedTo: static,
    //   yAxis: 2,
    //   params: {
    //       period: 50
    //   }
    // },
    
    // , {
    //   type: 'chaikin',
    //   linkedTo: static,
    //   yAxis: 2,
    //   params: {
    //       volumeSeriesID: 'volume'
    //   }
    // },
    // {
    //   type: 'mfi',
    //   linkedTo: static,
    //   yAxis: 2,
    //   decimals: 4,
    //   marker: {
    //       enabled: false
    //   },
    //   params: {
    //       period: 14
    //   }
    // },
    // , {
    //   yAxis: 2,
    //   type: 'stochastic',
    //   linkedTo: static
    // }
    // , {
    //   yAxis: 3,
    //   type: 'rsi',
    //   linkedTo: static
    // }
  
      
    ],
    
    yAxis:[
      {
        gridLineWidth: 0,
        opposite:true,
        height: '60%',
        resize: {
          enabled: true
        },
        plotLines: [{
          color: 'transparent', // Color value
          dashStyle: 'solid', // Style of the plot line. Default to solid
          value: 1, // Value of where the line will appear
          width: 3, // Width of the line    
          events: {
            click: function () {
              const updatedOptions = { ...testcandlestick };
              updatedOptions.yAxis[0].plotLines[0].color = "transparent"
              setcandlestick(updatedOptions);
            },
          }
        }]
        
      },
      {
        gridLineWidth: 0,
        opposite:false,
        top: '20%',
        height: '40%',
        resize: {
          enabled: true
        },
       
      },{
        gridLineWidth: 0,
        opposite:true,
        top: '60%',
        height: '20%',
        resize: {
          enabled: true
        },
      },
      {
        gridLineWidth: 0,
        opposite:true,
        top: '80%',
        height: '20%',
        resize: {
          enabled: true
        },
      }
      
    ],
    tooltip: {
      shape: 'square',
      headerShape: 'callout',
      borderWidth: 0,
      shadow: true,
      backgroundColor:  isDark ? "#16181A" : "#FFFFFF",
      style: {
        color:  isDark ? "#FFFFFF" : "#16181A"
      },
      positioner: function (width, height, point) {
          var chart = this.chart,
              position;

          if (point.isHeader) {
              position = {
                  x: Math.max(
                      // Left side limit
                      chart.plotLeft,
                      Math.min(
                          point.plotX + chart.plotLeft - width / 2,
                          // Right side limit
                          chart.chartWidth - width - chart.marginRight
                      )
                  ),
                  y: point.plotY
              };
          } else {
              position = {
                  x: point.series.chart.plotLeft,
                  y: point.series.yAxis.top - chart.plotTop
              };
          }

          return position;
      }
  },
    xAxis:[{
      resize: {
        enabled: true
      },
      plotLines:[
        {
          color: 'red', // Color value
          dashStyle: 'solid', // Style of the plot line. Default to solid
          value: 0, // Value of where the line will appear
          width: 3, // Width of the line    
          events: {
            click: function () {
              const updatedOptions = { ...testcandlestick };
              updatedOptions.xAxis[0].plotLines[0].color = "transparent"
              setcandlestick(updatedOptions);
            },
          }
        }
      ]
    }],
    plotOptions: {
      series: {
        yAxis: 0, 
      },
    },
    
   
      };
 
      const [testcandlestick,setcandlestick]=useState(candlestick)

      async function getChartData(script,period,time){
    
        await fetch("http://localhost:5000/longhistory/"+script + "/"+ period+"/"+time,{method:"GET"})
         .then(response => {
           if (response.ok) {
             return response.json();
           } else {
             throw new Error('Request failed:', response.status);
           }
         })
         .then(data => {
           setalldata(data)
           setseparatechart(data)
          setcandlestick((prevState) => {
            const updatedSeries = prevState.series.map((obj, i) => {
              if (i === 0) {
                return { ...obj, 
                  data: [...separatechart.map(obj=>
                    [new Date(obj.Date).getTime(),obj.Open,obj.High,obj.Low,obj.Close]
                  ),[new Date(currdate.slice(0,10)).getTime(),parseFloat((scriptData.open).split(',').join("")),scriptData.high,scriptData.low,parseFloat(price.split(',').join(""))]], 
            };
              }
              return obj;
            });
        
            return { ...prevState, series: updatedSeries };
          });
           console.log(data)
         })
         .catch(error => {
           console.error('Error:', error);
         });
    
     }

     async function getShortChartData(script,period,time){
    
      await fetch("http://localhost:5000/shorthistory/"+script + "/"+ period+"/"+time,{method:"GET"})
       .then(response => {
         if (response.ok) {
           return response.json();
         } else {
           throw new Error('Request failed:', response.status);
         }
       })
       .then(data => {
         setalldata(data)
        
         setseparatechart(data)
         console.log(data)
         setcandlestick((prevState) => {
          const updatedSeries = prevState.series.map((obj, i) => {
            if (i === 0) {
              return { ...obj, 
                data: [...separatechart.map(obj=>
                  [new Date(obj.Date).getTime(),obj.Open,obj.High,obj.Low,obj.Close]
                ),[new Date(currdate.slice(0,10)).getTime(),parseFloat((scriptData.open).split(',').join("")),scriptData.high,scriptData.low,parseFloat(price.split(',').join(""))]], 
          };
            }
            return obj;
          });
      
          return { ...prevState, series: updatedSeries };
        });
         
       })
       .catch(error => {
         console.error('Error:', error);
       });
  
   }

     async function getStaticData(script){
        try {
            const body = {script};
            const response = await fetch("http://localhost:5001/price",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(body)
            })

            const res = await response.json();
            
            setscriptData(
                {...scriptData,
                    prev:res.prev_close,
                    open:res.open,
                    volume:res.volume,
                    cap:res.market_cap,
                    pe:res.PEratio,
                    high:res.high,
                    low:res.low,
                    fiftytwo:res.fiftytwoweek,
                    range:res.range
                }
            )
        }catch(err){
            console.error(err.message);
        }
  }

  async function getPrice(script){
    try {
        const body = {script};
        const response = await fetch("http://localhost:5001/currentPrice",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(body)
        })

        const res = await response.json();
        setprice(res.price);

    }catch(err){
        console.error(err.message);
    }
        
}

     useEffect(()=>{
        const script = pathname.slice(14,);
        getStaticData(script)
        getPrice(script)
        getChartData(script,"max","1d")
        // getShortChartData(pathname.slice(14,),"7d","1m")
        // getShortChartData(pathname.slice(14,),"7d","2m")
        // getShortChartData(pathname.slice(14,),"1mo","5m")
        // getShortChartData(pathname.slice(14,),"1mo","15m")
        // getShortChartData(pathname.slice(14,),"3mo","30m")
        setcandlestick(candlestick)
        if (typeof window !== 'undefined') {
          if(localStorage.getItem("theme")==="true"){
            setIsDark(true)
          }else if(localStorage.getItem("theme")==="false"){
            setIsDark(false)
          }else{
            return
          }
      }
  
        if(isDark){
          setcandlestick(
             {...testcandlestick,
              chart:{ 
                style: {
                // backgroundColor:"#16181A",
              }
            },
            legend:{
              backgroundColor: "#16181A",   
              itemStyle: {
                color: "#ffffff"
              }
            },
            rangeSelector: {
              buttonTheme: {
                style: {
                  fill: "#000000",
                
                  color: "#000000",
                  backgroundColor:"#000000",
                  
                }
              },
            },
            tooltip: {
              backgroundColor: "#16181A",
              style: {
                color: "#ffffff"
              },
            }

          })
          
        }else{
          setcandlestick(
            {...testcandlestick,
             chart:{ 
               style: {
              //  backgroundColor:"#ffffff",
             }
           },
           legend:{
            backgroundColor: "#ffffff",   
            itemStyle: {
              color: "#000000"
            }
          },
          rangeSelector: {
            buttonTheme: {
              style: {
                fill: "#ffffff",
              
                color: "#000000",
                backgroundColor:"#ffffff",
                
              }
            },
          },
          tooltip: {
            backgroundColor: "#ffffff",
            style: {
              color: "#000000"
            },
          }

         })
        }
        let i=1;
        stock.forEach(stock=>{
          stock.key = i++;
        })
        //document.body.className = testtheme;
     },[theme,testtheme,isDark,ChartMainType,firstOverlay,secOss,firstOss])

     const loadMoreItems = () => {
    // Calculate the next page range
    const currentLength = displayedItems.length;
    const nextStartIndex = currentLength;
    const nextEndIndex = nextStartIndex + itemsPerPage;

    // Load and append the next page of items
    const nextPageItems = stock.slice(nextStartIndex, nextEndIndex);
    setDisplayedItems(prevItems => [...prevItems, ...nextPageItems]);
  };
  const buttonStyle = {
    margin:"10px"
  };
    return(

      <NextThemesProvider
        defaultTheme="dark"
        attribute="class"
        value={{
          light: lightTheme.className,
          dark: darkTheme.className
        }}
         >
      <NextUIProvider theme={isDark ? darkTheme : lightTheme}>
        <div className='totalchartarea'>
        <Navbar isCompact shouldHideOnScroll variant={"sticky"} css={{width:"100%", backgroundColor:"$background"}}>
        <Navbar.Toggle showIn="xs" aria-label="toggle navigation" />
        <Navbar.Content>
        <Navbar.Item>
                  <Dropdown light color="default" type="menu">
                    <Dropdown.Button light color="default">{pathname.slice(14,)}</Dropdown.Button>
                    <Dropdown.Menu aria-label="Dynamic Actions" items={stock.slice(0,500)} css={{height:"400px"}}>
                      {(item) => (
                        <Dropdown.Item
                          key={item.key}
                          
                          color={item.key === "delete" ? "error" : "default"}
                        >
                          <Button light auto color="default" onClick={abc=>travel(item.label)}>
                              {item.label}
                          </Button>
                          
                        </Dropdown.Item>
                      )}
                      
                    </Dropdown.Menu>
                  </Dropdown>
                  </Navbar.Item>
        </Navbar.Content>
        <Navbar.Content hideIn="xs">

        {/* <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    
                    options={stock}
                    getOptionLabel={option => option.label}
                    sx={{ width: 180 ,color:isDark ? "white" : "black",backgroundColor:isDark ? "black" : "#ffffff"}}
                    
                    onInputChange={handleChange}
                    renderInput={(params) => 
                    <TextField 
                      
                      {...params} 
                      variant="outlined"
                      label={pathname.slice(14,)}
                      sx={{color:isDark ? "black" : "white", border:"none", borderRadius:'0px'}}
                      disabled
                      />}
                      renderOption={(props, option) => (
                        <li {...props} className="MuiAutocomplete-option" >
                          <p style={{ color: '#16181A' }}>{option.label}</p>
                        </li>
                      )}
                  /> */}
                  
                    
          <Navbar.Item>
          <Dropdown >
            <Dropdown.Button light color="default" >
              Chart Type
            </Dropdown.Button>
            <Dropdown.Menu
              color="default"
              aria-label="Actions"
              css={{ $$dropdownMenuWidth: "280px" }}
            >
              <Dropdown.Section title="Primary" css={buttonStyle}>
                <Dropdown.Item
                >
                  
                  <Button 
                  light color="default" auto
      
                  onClick={abc=>{
                    setChartMainType("candlestick")
                  }}
                  >Candlestick</Button>
                </Dropdown.Item>
                <Dropdown.Item
                >
                  <Button 
                  light color="default" auto
                 
                  onClick={abc=>{
                    setChartMainType("candlestick")
                  }}
                    >Hollow Candlestick</Button>
                  
                </Dropdown.Item>
                <Dropdown.Item
                  
                
                >
                  
                  <Button 
                  light color="default" auto
                  
                   >Heikenashi</Button>
                </Dropdown.Item>
                </Dropdown.Section>

                <Dropdown.Section title="Secondary">
                <Dropdown.Item
                 
               
               >
                 
                 <Button 
                 light color="default" auto
               
                onClick={abc=>{
                  setChartMainType("areaspline")
                }}
                >Area</Button>
               </Dropdown.Item>
               <Dropdown.Item
               >
                 <Button 
                 light color="default" auto
              
                onClick={abc=>{
                  setChartMainType("ohlc")
                }}
                >OHLC</Button>
                 
               </Dropdown.Item>
               <Dropdown.Item
                 
                 // icon={
                 //   <AddNoteIcon size={22} fill="var(--nextui-colors-primary)" />
                 // }
               >
                 
                 <Button 
                 light color="default" auto
               
                onClick={abc=>{
                  setChartMainType("spline")
                }}
                >Spline</Button>
               </Dropdown.Item>
                </Dropdown.Section>
             
            </Dropdown.Menu>
          </Dropdown>
          </Navbar.Item>
       
          
          <Navbar.Item>
          <Dropdown >
            <Dropdown.Button light color="default">
            Overlay Indicators
            </Dropdown.Button>
            <Dropdown.Menu
              color="default"
              aria-label="Actions"
              css={{ $$dropdownMenuWidth: "280px" }}
            >
              <Dropdown.Section title="Primary" css={buttonStyle}>
                <Dropdown.Item
                 
                  // icon={
                  //   <AddNoteIcon size={22} fill="var(--nextui-colors-primary)" />
                  // }
                >
                  
                  <Button 
                  light color="default" auto
        
                  onClick={abc=>{
                    firstsetOverlay("pc")
                  }}
                    >PC Bands</Button>
                </Dropdown.Item>
                <Dropdown.Item
                >
                  <Button 
                  light color="default" auto
                  
                  onClick={abc=>{
                    firstsetOverlay("ema")
                  }}
                    >EMA</Button>
                  
                </Dropdown.Item>
                <Dropdown.Item
                  
                  // icon={
                  //   <AddNoteIcon size={22} fill="var(--nextui-colors-primary)" />
                  // }
                >
                  
                  <Button 
                  light color="default" auto
                 
                    onClick={abc=>{
                      firstsetOverlay("tema")
                    }}
                    >TEMA</Button>
                </Dropdown.Item>
                

                
                <Dropdown.Item
                 
                 // icon={
                 //   <AddNoteIcon size={22} fill="var(--nextui-colors-primary)" />
                 // }
               >
                 
                 <Button 
                 light color="default" auto
               
                onClick={abc=>{
                  firstsetOverlay("sma")
                }}
                  >SMA</Button>
               </Dropdown.Item>
               <Dropdown.Item
               >
                 <Button 
                 light color="default" auto
               
                onClick={abc=>{
                  firstsetOverlay("dema")
                }}
                  >DEMA</Button>
                 
               </Dropdown.Item>
               <Dropdown.Item
        
               >
                 
                 <Button 
                 light color="default" auto
               
                onClick={abc=>{
                  firstsetOverlay("bb")
                }}
                  >Bollinger Band</Button>
               </Dropdown.Item>

               <Dropdown.Item
                 
               >
                 
                 <Button 
                 light color="default" auto
               
                  onClick={abc=>{
                    firstsetOverlay("vbp")
                  }}
                  >Volume by Price</Button>
               </Dropdown.Item>

               <Dropdown.Item
                 
               >
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  firstsetOverlay("priceenvelopes")
                }}
                  >Price Envelopes</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  firstsetOverlay("psar")
                }}
                  >Parabolic SAR</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  firstsetOverlay("linearRegression")
                }}
                  >Linear Regression</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  firstsetOverlay("supertrend")
                }}
                  >Supertrend</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  firstsetOverlay("vwap")
                }}
                  >VWAP</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  firstsetOverlay("wma")
                }}
                  >Weighted Avg Price</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  firstsetOverlay("zigzag")
                }}
                  >Zig Zag</Button>
               </Dropdown.Item>


                </Dropdown.Section>
             
            </Dropdown.Menu>
          </Dropdown>
          </Navbar.Item>
          
              
          <Navbar.Item>

          <Dropdown >
                <Dropdown.Button light color="default" >
                 Oscillations Indicators
                </Dropdown.Button>
                <Dropdown.Menu
                  color="default"
                  aria-label="Actions"
                  css={{ $$dropdownMenuWidth: "280px" }}
                >
                  <Dropdown.Section title="Primary" css={buttonStyle}>
                  <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setfirstOss("apo")
                }}
                  >Absolute Price Oscillation</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setfirstOss("ad")
                }}
                  >A/D (Accumulation/Distribution)</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setfirstOss("aroon")
                }}
                  >Aroon</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setfirstOss("ao")
                }}
                  >Awesome Oscillator</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setfirstOss("rsi")
                }}
                  >RSI</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setfirstOss("aroonoscillator")
                }}
                  >Aroon Oscillator</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setfirstOss("atr")
                }}
                  >Avg True Range</Button>
               </Dropdown.Item>

                    </Dropdown.Section>




                    <Dropdown.Section title="Secondary">
                    <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setsecOss("cci")
                }}
                  >Commodity Channel Index</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setsecOss("chaikin")
                }}
                  >Chiakin</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setsecOss("mfi")
                }}
                  >Money Flow Index</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setsecOss("momentum")
                }}
                  >Momentum</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setsecOss("stochastic")
                }}
                  >Stochastic</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setsecOss("macd")
                }}
                  >MACD</Button>
               </Dropdown.Item>
               
                    
                    </Dropdown.Section>
                
                </Dropdown.Menu>
              </Dropdown>
          </Navbar.Item>

          <Navbar.Item>

          <Dropdown >
                <Dropdown.Button light color="default" >
                 Time Interval
                </Dropdown.Button>
                <Dropdown.Menu
                  color="default"
                  aria-label="Actions"
                  css={{ $$dropdownMenuWidth: "280px" }}
                >
                  
                  <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={async abc=>{
                  await getShortChartData(pathname.slice(14,),"7d","1m")
                }}
                  >1m</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                 onClick={async abc=>{
                  await getShortChartData(pathname.slice(14,),"7d","2m")
                }}
                  >2m</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                 onClick={async abc=>{
                  await getShortChartData(pathname.slice(14,),"1mo","5m")
                }}
                  >5m</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                 onClick={async abc=>{
                  await getShortChartData(pathname.slice(14,),"1mo","15m")
                }}
                  >15m</Button>
               </Dropdown.Item>

        
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                 onClick={async abc=>{
                  await getShortChartData(pathname.slice(14,),"6mo","1h")
                }}
                  >1hr</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                 onClick={async abc=>{
                  await getChartData(pathname.slice(14,),"max","1d")
                }}
                  >1D</Button>
               </Dropdown.Item>

                    
                    <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                 onClick={async abc=>{
                  await getChartData(pathname.slice(14,),"max","1wk")
                }}
                  >1W</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                 onClick={async abc=>{
                  await getChartData(pathname.slice(14,),"max","1mo")
                }}
                  >1M</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                 onClick={async abc=>{
                  await getChartData(pathname.slice(14,),"max","3mo")
                }}
                  >3M</Button>
               </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
          </Navbar.Item>

          <Navbar.Link color="inherit" href="#">
            Signup
          </Navbar.Link>
          <Navbar.Item>
            <Button auto flat as={Link} href="#">
            <Link href={'/login'}>Login</Link>
            </Button>
            
          </Navbar.Item>
          
        </Navbar.Content>
        <Navbar.Content>
          
          <Navbar.Item>
          <Switch
          checked={!isDark}
          onChange={(e) => testsetTheme(e.target.checked ? 
            abc=>
            {setIsDark(false)
              localStorage.setItem("theme",false)
            } : 
            abc=>
            {setIsDark(true)
              localStorage.setItem("theme",true)
            })}
          size="xl"
          iconOn={<SunIcon filled />}
          iconOff={<MoonIcon filled />}
        />
            
          </Navbar.Item>
        </Navbar.Content>
        <Navbar.Collapse css={{
        }}>
        <Navbar.CollapseItem>
        
          <Dropdown >
            <Dropdown.Button light color="default" auto >
              Chart Type
            </Dropdown.Button>
            <Dropdown.Menu
              color="default"
              aria-label="Actions"
              css={{ $$dropdownMenuWidth: "280px" }}
            >
              <Dropdown.Section title="Primary" css={buttonStyle}>
                <Dropdown.Item
                 
                  // icon={
                  //   <AddNoteIcon size={22} fill="var(--nextui-colors-default)" />
                  // }
                >
                  
                  <Button 
                  light color="default" auto
        
                  
                  onClick={abc=>{
                    setChartMainType("candlestick")
                  }}
                  >Candlestick</Button>
                </Dropdown.Item>
                <Dropdown.Item
                >
                  <Button 
                  light color="default" auto
              
                  onClick={abc=>{
                    setChartMainType("candlestick")
                  }}
                    >Hollow Candlestick</Button>
                  
                </Dropdown.Item>
                <Dropdown.Item
                  
                  // icon={
                  //   <AddNoteIcon size={22} fill="var(--nextui-colors-primary)" />
                  // }
                >
                  
                  <Button 
                  light color="default" auto
                 
                  onClick={abc=>{
                    setChartMainType("candlestick")
                  }} >Heikenashi</Button>
                </Dropdown.Item>
                </Dropdown.Section>

                <Dropdown.Section title="Secondary">
                <Dropdown.Item
                 
                 // icon={
                 //   <AddNoteIcon size={22} fill="var(--nextui-colors-default)" />
                 // }
               >
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setChartMainType("areaspline")
                }}
                >Area</Button>
               </Dropdown.Item>
               <Dropdown.Item
               >
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setChartMainType("ohlc")
                }}
                >OHLC</Button>
                 
               </Dropdown.Item>
               <Dropdown.Item
                 
                 // icon={
                 //   <AddNoteIcon size={22} fill="var(--nextui-colors-default)" />
                 // }
               >
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setChartMainType("spline")
                }}
                >Spline</Button>
               </Dropdown.Item>
                </Dropdown.Section>
             
            </Dropdown.Menu>
          </Dropdown>
         
                </Navbar.CollapseItem>
                <Navbar.CollapseItem>
        
          <Dropdown >
            <Dropdown.Button light color="default" auto>
            Overlay Indicators
            </Dropdown.Button>
            <Dropdown.Menu

              color="default"
              aria-label="Actions"
              css={{ $$dropdownMenuWidth: "280px" }}
            >
              <Dropdown.Section title="Primary" css={buttonStyle}>
                <Dropdown.Item
            
                >
                  
                  <Button 
                  light color="default" auto
                  onClick={abc=>{
                    firstsetOverlay("pc")
                  }}
                    >PC Bands</Button>
                </Dropdown.Item>
                <Dropdown.Item
                >
                  <Button 
                  light color="default" auto
                  onClick={abc=>{
                    firstsetOverlay("ema")
                  }}
                    >EMA</Button>
                  
                </Dropdown.Item>
                <Dropdown.Item
    
                >
                  
                  <Button 
                  light color="default" auto
  
                    onClick={abc=>{
                      firstsetOverlay("tema")
                    }}
                    >TEMA</Button>
                </Dropdown.Item>
                

                
                <Dropdown.Item
        
               >
                 
                 <Button 
                 light color="default" auto
      
                onClick={abc=>{
                  firstsetOverlay("sma")
                }}
                  >SMA</Button>
               </Dropdown.Item>
               <Dropdown.Item
               >
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  firstsetOverlay("dema")
                }}
                  >DEMA</Button>
                 
               </Dropdown.Item>
               <Dropdown.Item
               
               >
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  firstsetOverlay("bb")
                }}
                  >Bollinger Band</Button>
               </Dropdown.Item>

               <Dropdown.Item
              
               >
                 
                 <Button 
                 light color="default" auto
               
                  onClick={abc=>{
                    firstsetOverlay("vbp")
                  }}
                  >Volume by Price</Button>
               </Dropdown.Item>

               <Dropdown.Item
              
               >
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  firstsetOverlay("priceenvelopes")
                }}
                  >Price Envelopes</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  firstsetOverlay("psar")
                }}
                  >Parabolic SAR</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  firstsetOverlay("linearRegression")
                }}
                  >Linear Regression</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  firstsetOverlay("supertrend")
                }}
                  >Supertrend</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  firstsetOverlay("vwap")
                }}
                  >VWAP</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  firstsetOverlay("wma")
                }}
                  >Weighted Avg Price</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  firstsetOverlay("zigzag")
                }}
                  >Zig Zag</Button>
               </Dropdown.Item>


                </Dropdown.Section>
             
            </Dropdown.Menu>
          </Dropdown>
          </Navbar.CollapseItem>

          <Navbar.CollapseItem>
          <Dropdown >
                <Dropdown.Button light color="default" >
                 Oscillations Indicators
                </Dropdown.Button>
                <Dropdown.Menu
                  color="default"
                  aria-label="Actions"
                  css={{ $$dropdownMenuWidth: "280px" }}
                >
                  <Dropdown.Section title="Primary" css={buttonStyle}>
                  <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setfirstOss("apo")
                }}
                  >Absolute Price Oscillation</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setfirstOss("ad")
                }}
                  >A/D (Accumulation/Distribution)</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setfirstOss("aroon")
                }}
                  >Aroon</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setfirstOss("ao")
                }}
                  >Awesome Oscillator</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setfirstOss("rsi")
                }}
                  >RSI</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setfirstOss("aroonoscillator")
                }}
                  >Aroon Oscillator</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setfirstOss("atr")
                }}
                  >Avg True Range</Button>
               </Dropdown.Item>

                    </Dropdown.Section>




                    <Dropdown.Section title="Secondary">
                    <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setsecOss("cci")
                }}
                  >Commodity Channel Index</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setsecOss("chaikin")
                }}
                  >Chiakin</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setsecOss("mfi")
                }}
                  >Money Flow Index</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setsecOss("momentum")
                }}
                  >Momentum</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setsecOss("stochastic")
                }}
                  >Stochastic</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={abc=>{
                  setsecOss("macd")
                }}
                  >MACD</Button>
               </Dropdown.Item>
               
                    
                    </Dropdown.Section>
                
                </Dropdown.Menu>
              </Dropdown>

</Navbar.CollapseItem>
<Navbar.CollapseItem>
          <Dropdown >
                <Dropdown.Button light color="default" >
                 Time Interval
                </Dropdown.Button>
                <Dropdown.Menu
                  color="default"
                  aria-label="Actions"
                  css={{ $$dropdownMenuWidth: "280px" }}
                >
                  
                  <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                onClick={async abc=>{
                  await getShortChartData(pathname.slice(14,),"7d","1m")
                }}
                  >1m</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                 onClick={async abc=>{
                  await getShortChartData(pathname.slice(14,),"7d","2m")
                }}
                  >2m</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                 onClick={async abc=>{
                  await getShortChartData(pathname.slice(14,),"1mo","5m")
                }}
                  >5m</Button>
               </Dropdown.Item>

               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                 onClick={async abc=>{
                  await getShortChartData(pathname.slice(14,),"1mo","15m")
                }}
                  >15m</Button>
               </Dropdown.Item>

        
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                 onClick={async abc=>{
                  await getShortChartData(pathname.slice(14,),"6mo","1h")
                }}
                  >1hr</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                 onClick={async abc=>{
                  await getChartData(pathname.slice(14,),"max","1d")
                }}
                  >1D</Button>
               </Dropdown.Item>

                    
                    <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                 onClick={async abc=>{
                  await getChartData(pathname.slice(14,),"max","1wk")
                }}
                  >1W</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                 onClick={async abc=>{
                  await getChartData(pathname.slice(14,),"max","1mo")
                }}
                  >1M</Button>
               </Dropdown.Item>
               <Dropdown.Item>
                 
                 <Button 
                 light color="default" auto
                
                 onClick={async abc=>{
                  await getChartData(pathname.slice(14,),"max","3mo")
                }}
                  >3M</Button>
               </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              </Navbar.CollapseItem>
         
       
        
      </Navbar.Collapse>
      </Navbar>
         
             <div className='guiforcharts'>
              
          <div className='guiOptions'>
          
          {/* 
         <Dropdown onClick={abc=>setload(true)}>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
              <Image src={osindi} width="25" height={25}></Image>
              Oscillations Indicators
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={abc=>{
                setcandlestick((prevState) => {
                    const updatedSeries = prevState.series.map((obj, i) => {
                    if (i === 3) {
                        return { ...obj, type: "apo" };
                    }
                    return obj;
                    });
                
                    return { ...prevState, series: updatedSeries };
                });
                }}>Absolute Price Oscillation</Dropdown.Item>


                    <Dropdown.Item onClick={abc=>{
                setcandlestick((prevState) => {
                    const updatedSeries = prevState.series.map((obj, i) => {
                    if (i === 3) {
                        return { ...obj, type: "ad" };
                    }
                    return obj;
                    });
                
                    return { ...prevState, series: updatedSeries };
                });
                }}>A/D (Accumulation/Distribution)</Dropdown.Item>


                <Dropdown.Item onClick={abc=>{
                setcandlestick((prevState) => {
                    const updatedSeries = prevState.series.map((obj, i) => {
                    if (i === 3) {
                        return { ...obj, type: "aroon" };
                    }
                    return obj;
                    });
                
                    return { ...prevState, series: updatedSeries };
                });
                }}>Aroon</Dropdown.Item>

<Dropdown.Item onClick={abc=>{
                setcandlestick((prevState) => {
                    const updatedSeries = prevState.series.map((obj, i) => {
                    if (i === 3) {
                        return { ...obj, type: "aroonoscillator" };
                    }
                    return obj;
                    });
                
                    return { ...prevState, series: updatedSeries };
                });
                }}>Aroon Oscillator</Dropdown.Item>


                    <Dropdown.Item onClick={abc=>{
                setcandlestick((prevState) => {
                    const updatedSeries = prevState.series.map((obj, i) => {
                    if (i === 3) {
                        return { ...obj, type: "atr" };
                    }
                    return obj;
                    });
                
                    return { ...prevState, series: updatedSeries };
                });
                }}>ATR (Avg True Range)</Dropdown.Item>


                <Dropdown.Item onClick={abc=>{
                setcandlestick((prevState) => {
                    const updatedSeries = prevState.series.map((obj, i) => {
                    if (i === 3) {
                        return { ...obj, type: "ao" };
                    }
                    return obj;
                    });
                
                    return { ...prevState, series: updatedSeries };
                });
                }}>Awesome Oscillator</Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item onClick={abc=>{
                setcandlestick((prevState) => {
                    const updatedSeries = prevState.series.map((obj, i) => {
                    if (i === 4) {
                        return { ...obj, type: "cci" };
                    }
                    return obj;
                    });
                
                    return { ...prevState, series: updatedSeries };
                });
                }}>Commodity Channel Index</Dropdown.Item>


                    <Dropdown.Item onClick={abc=>{
                setcandlestick((prevState) => {
                    const updatedSeries = prevState.series.map((obj, i) => {
                    if (i === 4) {
                        return { ...obj, type: "chaikin" };
                    }
                    return obj;
                    });
                
                    return { ...prevState, series: updatedSeries };
                });
                }}>Chaikin</Dropdown.Item>


                <Dropdown.Item onClick={abc=>{
                setcandlestick((prevState) => {
                    const updatedSeries = prevState.series.map((obj, i) => {
                    if (i === 4) {
                        return { ...obj, type: "mfi" };
                    }
                    return obj;
                    });
                
                    return { ...prevState, series: updatedSeries };
                });
                }}>Money Flow Index</Dropdown.Item>

<Dropdown.Item onClick={abc=>{
                setcandlestick((prevState) => {
                    const updatedSeries = prevState.series.map((obj, i) => {
                    if (i === 4) {
                        return { ...obj, type: "momentum" };
                    }
                    return obj;
                    });
                
                    return { ...prevState, series: updatedSeries };
                });
                }}>Momentum</Dropdown.Item>


                    <Dropdown.Item onClick={abc=>{
                setcandlestick((prevState) => {
                    const updatedSeries = prevState.series.map((obj, i) => {
                    if (i === 4) {
                        return { ...obj, type: "stochastic" };
                    }
                    return obj;
                    });
                
                    return { ...prevState, series: updatedSeries };
                });
                }}>Stochastic</Dropdown.Item>


                <Dropdown.Item onClick={abc=>{
                setcandlestick((prevState) => {
                    const updatedSeries = prevState.series.map((obj, i) => {
                    if (i === 4) {
                        return { ...obj, type: "rsi" };
                    }
                    return obj;
                    });
                
                    return { ...prevState, series: updatedSeries };
                });
                }}>RSI</Dropdown.Item>

              </Dropdown.Menu>


         </Dropdown>

         <Dropdown onClick={abc=>setload(true)}>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                Themes
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={abc=>setcandlestick({
                    ...testcandlestick,
                    theme: "dark-unica"
                })}>Theme1</Dropdown.Item>
                <Dropdown.Item onClick={abc=>setcandlestick({
                    ...testcandlestick,
                    theme: theme2
                })}>Theme2</Dropdown.Item>
                <Dropdown.Item onClick={abc=>settheme(theme3(Highcharts))}>Action</Dropdown.Item>
                <Dropdown.Item onClick={abc=>settheme(theme4(Highcharts))}>Action</Dropdown.Item>
                <Dropdown.Item onClick={abc=>settheme(theme5(Highcharts))}>Action</Dropdown.Item>
                <Dropdown.Item onClick={abc=>settheme(theme6(Highcharts))}>Action</Dropdown.Item>
                <Dropdown.Item onClick={abc=>settheme(theme7(Highcharts))}>Action</Dropdown.Item>
                <Dropdown.Item onClick={abc=>settheme(theme8(Highcharts))}>Action</Dropdown.Item>
                <Dropdown.Item onClick={abc=>settheme(theme9(Highcharts))}>Action</Dropdown.Item>
                <Dropdown.Item onClick={abc=>settheme(theme10(Highcharts))}>Action</Dropdown.Item>
                <Dropdown.Item onClick={abc=>settheme(theme11(Highcharts))}>Action</Dropdown.Item>
                <Dropdown.Item onClick={abc=>settheme(theme12(Highcharts))}>Action</Dropdown.Item>
                <Dropdown.Item onClick={abc=>settheme(theme13(Highcharts))}>Action</Dropdown.Item>
                <Dropdown.Item onClick={abc=>settheme(theme14(Highcharts))}>Action</Dropdown.Item>
              </Dropdown.Menu>
         </Dropdown>


         <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                Text
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
              </Dropdown.Menu>
         </Dropdown>

         <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                Lines
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={abc=>{return document.addEventListener("click", printMousePos,{ once: true })}}>Lines</Dropdown.Item>
                <Dropdown.Item onClick={abc=>{return document.addEventListener("click", printMousePos2,{ once: true })}}>Another action</Dropdown.Item>
                <Dropdown.Item onClick={abc=>{return document.addEventListener('click', handleClick,{ once: true });}}>Something else</Dropdown.Item>
              </Dropdown.Menu>
         </Dropdown>

         <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                Crooked Lines
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
              </Dropdown.Menu>
         </Dropdown>

         <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                Measure
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
              </Dropdown.Menu>
         </Dropdown>

         <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                Advanced
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
              </Dropdown.Menu>
         </Dropdown>

         <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                Time Interval
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={async abc=>{
                      await getShortChartData(pathname.slice(14,),"7d","1m")
                      setcandlestick((prevState) => {
                        const updatedSeries = prevState.series.map((obj, i) => {
                          if (i === 0) {
                            return { ...obj, data: [...separatechart.map(obj=>
                              [new Date(obj.Date).getTime(),obj.Open,obj.High,obj.Low,obj.Close]
                            ),[new Date(currdate.slice(0,10)).getTime(),parseFloat((scriptData.open).split(',').join("")),scriptData.high,scriptData.low,parseFloat(price.split(',').join(""))]], 
                        };
                          }
                          return obj;
                        });
                    
                        return { ...prevState, series: updatedSeries };
                      });
                    }
                  }>1m</Dropdown.Item>
                <Dropdown.Item onClick={async abc=>{await getShortChartData(pathname.slice(14,),"7d","2m")
                setcandlestick((prevState) => {
                  const updatedSeries = prevState.series.map((obj, i) => {
                    if (i === 0) {
                      return { ...obj, data: [...separatechart.map(obj=>
                        [new Date(obj.Date).getTime(),obj.Open,obj.High,obj.Low,obj.Close]
                      ),[new Date(currdate.slice(0,10)).getTime(),parseFloat((scriptData.open).split(',').join("")),scriptData.high,scriptData.low,parseFloat(price.split(',').join(""))]], 
                  };
                    }
                    return obj;
                  });
              
                  return { ...prevState, series: updatedSeries };
                })}
              }>2m</Dropdown.Item>
                <Dropdown.Item onClick={async abc=>{await getShortChartData(pathname.slice(14,),"1mo","5m")
              setcandlestick((prevState) => {
                const updatedSeries = prevState.series.map((obj, i) => {
                  if (i === 0) {
                    return { ...obj, data: [...separatechart.map(obj=>
                      [new Date(obj.Date).getTime(),obj.Open,obj.High,obj.Low,obj.Close]
                    ),[new Date(currdate.slice(0,10)).getTime(),parseFloat((scriptData.open).split(',').join("")),scriptData.high,scriptData.low,parseFloat(price.split(',').join(""))]], 
                };
                  }
                  return obj;
                });
            
                return { ...prevState, series: updatedSeries };
              })}}>5m</Dropdown.Item>
                <Dropdown.Item onClick={async abc=>{await getShortChartData(pathname.slice(14,),"1mo","15m")
              setcandlestick((prevState) => {
                const updatedSeries = prevState.series.map((obj, i) => {
                  if (i === 0) {
                    return { ...obj, data: [...separatechart.map(obj=>
                      [new Date(obj.Date).getTime(),obj.Open,obj.High,obj.Low,obj.Close]
                    ),[new Date(currdate.slice(0,10)).getTime(),parseFloat((scriptData.open).split(',').join("")),scriptData.high,scriptData.low,parseFloat(price.split(',').join(""))]], 
                };
                  }
                  return obj;
                });
            
                return { ...prevState, series: updatedSeries };
              })}}>15m</Dropdown.Item>
                <Dropdown.Item onClick={async abc=>{await getShortChartData(pathname.slice(14,),"3mo","30m")
              setcandlestick((prevState) => {
                const updatedSeries = prevState.series.map((obj, i) => {
                  if (i === 0) {
                    return { ...obj, data: [...separatechart.map(obj=>
                      [new Date(obj.Date).getTime(),obj.Open,obj.High,obj.Low,obj.Close]
                    ),[new Date(currdate.slice(0,10)).getTime(),parseFloat((scriptData.open).split(',').join("")),scriptData.high,scriptData.low,parseFloat(price.split(',').join(""))]], 
                };
                  }
                  return obj;
                });
            
                return { ...prevState, series: updatedSeries };
              })}}>30m</Dropdown.Item>
                <Dropdown.Item onClick={async abc=>{await getShortChartData(pathname.slice(14,),"6mo","1h")
              setcandlestick((prevState) => {
                const updatedSeries = prevState.series.map((obj, i) => {
                  if (i === 0) {
                    return { ...obj, data: [...separatechart.map(obj=>
                      [new Date(obj.Date).getTime(),obj.Open,obj.High,obj.Low,obj.Close]
                    ),[new Date(currdate.slice(0,10)).getTime(),parseFloat((scriptData.open).split(',').join("")),scriptData.high,scriptData.low,parseFloat(price.split(',').join(""))]], 
                };
                  }
                  return obj;
                });
            
                return { ...prevState, series: updatedSeries };
              })}}>1hr</Dropdown.Item>
                <Dropdown.Item onClick={async abc=>{await getChartData(pathname.slice(14,),"max","1d")
              setcandlestick((prevState) => {
                const updatedSeries = prevState.series.map((obj, i) => {
                  if (i === 0) {
                    return { ...obj, data: [...separatechart.map(obj=>
                      [new Date(obj.Date).getTime(),obj.Open,obj.High,obj.Low,obj.Close]
                    ),[new Date(currdate.slice(0,10)).getTime(),parseFloat((scriptData.open).split(',').join("")),scriptData.high,scriptData.low,parseFloat(price.split(',').join(""))]], 
                };
                  }
                  return obj;
                });
            
                return { ...prevState, series: updatedSeries };
              })}}>1D</Dropdown.Item>
                <Dropdown.Item onClick={async abc=>{await getChartData(pathname.slice(14,),"max","5d")
              setcandlestick((prevState) => {
                const updatedSeries = prevState.series.map((obj, i) => {
                  if (i === 0) {
                    return { ...obj, data: [...separatechart.map(obj=>
                      [new Date(obj.Date).getTime(),obj.Open,obj.High,obj.Low,obj.Close]
                    ),[new Date(currdate.slice(0,10)).getTime(),parseFloat((scriptData.open).split(',').join("")),scriptData.high,scriptData.low,parseFloat(price.split(',').join(""))]], 
                };
                  }
                  return obj;
                });
            
                return { ...prevState, series: updatedSeries };
              })}}>5D</Dropdown.Item>
                <Dropdown.Item onClick={async abc=>{await getChartData(pathname.slice(14,),"max","1wk")
              setcandlestick((prevState) => {
                const updatedSeries = prevState.series.map((obj, i) => {
                  if (i === 0) {
                    return { ...obj, data: [...separatechart.map(obj=>
                      [new Date(obj.Date).getTime(),obj.Open,obj.High,obj.Low,obj.Close]
                    ),[new Date(currdate.slice(0,10)).getTime(),parseFloat((scriptData.open).split(',').join("")),scriptData.high,scriptData.low,parseFloat(price.split(',').join(""))]], 
                };
                  }
                  return obj;
                });
            
                return { ...prevState, series: updatedSeries };
              })}}>1W</Dropdown.Item>
                <Dropdown.Item onClick={async abc=>{await getChartData(pathname.slice(14,),"max","1mo")
              setcandlestick((prevState) => {
                const updatedSeries = prevState.series.map((obj, i) => {
                  if (i === 0) {
                    return { ...obj, data: [...separatechart.map(obj=>
                      [new Date(obj.Date).getTime(),obj.Open,obj.High,obj.Low,obj.Close]
                    ),[new Date(currdate.slice(0,10)).getTime(),parseFloat((scriptData.open).split(',').join("")),scriptData.high,scriptData.low,parseFloat(price.split(',').join(""))]], 
                };
                  }
                  return obj;
                });
            
                return { ...prevState, series: updatedSeries };
              })}}>1M</Dropdown.Item>
                <Dropdown.Item onClick={async abc=>{await getChartData(pathname.slice(14,),"max","3mo")
              setcandlestick((prevState) => {
                const updatedSeries = prevState.series.map((obj, i) => {
                  if (i === 0) {
                    return { ...obj, data: [...separatechart.map(obj=>
                      [new Date(obj.Date).getTime(),obj.Open,obj.High,obj.Low,obj.Close]
                    ),[new Date(currdate.slice(0,10)).getTime(),parseFloat((scriptData.open).split(',').join("")),scriptData.high,scriptData.low,parseFloat(price.split(',').join(""))]], 
                };
                  }
                  return obj;
                });
            
                return { ...prevState, series: updatedSeries };
              })}}>3M</Dropdown.Item>
              </Dropdown.Menu>
         </Dropdown> */}

         
          </div>
          
         
          </div>
          <div className='sepcharts'>
         {load ?
                <HighchartsReact
                ref={testchart}
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={testcandlestick}
                containerProps={{ style: { height: '94vh' } }}
                
              /> : 
              <HighchartsReact
                ref={testchart}
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={candlestick}
                containerProps={{ style: { height: '94vh' }}}/>
            }
              
            </div>
        </div>
        </NextUIProvider>
        </NextThemesProvider>
    )
}