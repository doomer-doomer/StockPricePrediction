"use client"
import React, { useEffect, useState,useRef } from 'react'
import Image from 'next/image';
import up from '../[data]/arrow-up.png'
import down from '../[data]/down.png'
import nopic from '../[data]/nopic.png'
import "boxicons"
import { useRouter } from 'next/navigation';

import { usePathname, useSearchParams } from 'next/navigation';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import sand from 'highcharts/themes/sand-signika';
import HighchartsStock from 'highcharts/modules/stock';
import Indicators from 'highcharts/indicators/indicators'; // Import the Highcharts Indicators module

import accumdis from 'highcharts/indicators/accumulation-distribution'

import VisibilitySensor from 'react-visibility-sensor';
import { Skeleton } from '@mui/material';

import { Loading, NextUIProvider } from '@nextui-org/react';
import { Grid, Switch } from "@nextui-org/react";
import { SunIcon } from './sun';
import { MoonIcon } from './moon';

import { createTheme } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Navbar,Dropdown,Avatar, Button, Text, Card, Radio, theme } from "@nextui-org/react";
import Link from "next/link";


import 'bootstrap/dist/css/bootstrap.min.css';
sand(Highcharts);
HighchartsStock(Highcharts);
Indicators(Highcharts)
accumdis(Highcharts)

import { Helmet } from 'react-helmet';
import "./data.css"
import './newscss.css'
import Newsbox from './newsbox';
import GeneralChart from '../../../../components/charts/GeneralChart';
import ScriptChart from '../../../../components/charts/ScriptChart';

const lightTheme = createTheme({
  type: 'light',
  
})

const darkTheme = createTheme({
  type: 'dark',
  colors:{
    modes: {
      dark: {
        background: '#16181A', 
      },
    },
  }
  
})

export default function SingleStock(){

    const router = useRouter()
    var axios = require('axios');
    const pathname = usePathname();
    const [scriptname,setscriptname] = useState("");
    const [price,setprice] = useState("");
    const [news,setnews] =useState("");
    const [growthData,setgrowthData] = useState([]);
    const [growthData2,setgrowthData2] =useState(growthData)
    const [isDark, setIsDark] = useState(false);
    const [testtheme, testsetTheme] = useState('light');

    const [userData,setUserData]=useState({
      user_name:"",
      email:""
    })

    const [chartVisible, setChartVisible] = useState(false);
    const [chartVisible2, setChartVisible2] = useState(false);
    const [chartVisible3, setChartVisible3] = useState(false);
    const [scriptAllData,setscriptAllData] = useState({
      fiftytwochange:"",
      addrA:"",
      addrB:"",
      auditRisk:"",
      avgDailyVolume:"",
      avgVolume:"",
      avgtenVolume:"",
      beta:"",
      boardRisk:"",
      city:"",
      compensationRisk:"",
      currentPrice:"",
      currentRatio:"",
      dayHigh:"",
      dayLow:"",
      open:"",
      prevClose:"",
      overallRisk:"",
      longName:"",
      sector:"",
      industry:"",
      type:"",
      longBusinessSummary:"",
      debtToEquity:"",
      dividendRate:"",
      dividendYield:"",
      earningsGrowth:"",
      earningsQuarterlyGrowth:"",
      ebitda:"",
      ebitdaMargins:"",
      enterpriseToEbitda:"",
      enterpriseToRevenue:"",
      enterpriseValue:"",
      exDividendDate:"",
      exchange:"",
      fax:"",
      phone:"",
      fiftyDayAverage:"",
      fiftyTwoWeekHigh:"",
      fiftyTwoWeekLow:"",
      fiveYearAvgDividendYield:"",
      floatShares:"",
      freeCashflow:"",
      governanceEpochDate:"",
      grossMargins:"",
      heldPercentInsiders:"",
      heldPercentInstitutions:"",
      impliedSharesOutstanding:"",
      lastDividendDate:"",
      lastDividendValue:"",
      lastFiscalYearEnd:"",
      nextFiscalYearEnd:"",
      lastSplitDate:"",
      lastSplitFactor:"",
      marketCap:"",
      operatingCashflow:"",
      operatingMargins:"",
      payoutRatio:"",
      priceToSalesTrailing12Months:"",
      profitMargins:"",
      returnOnAssets:"",
      returnOnEquity:"",
      revenueGrowth:"",
      revenuePerShare:"",
      shareHolderRightsRisk:"",
      totalCash:"",
      totalCashPerShare:"",
      totalDebt:"",
      totalRevenue:"",
      trailingAnnualDividendRate:"",
      trailingAnnualDividendYield:"",
      trailingPE:"",
      twoHundredDayAverage:"",
      volume:"",
      website:"",
      zip:""

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

    const [scriptProfile,setscriptProfile] = useState({
        sector:"",
        industry:"",
        des:""
    })

    const [alldata,setalldata]=useState([])
    const [somedata,setsomedata]=useState(alldata)
    const [separatechart,setseparatechart]=useState(alldata)
    
    
    // const [overlayIndicators ,setoverlayIndicators]=useState({
    //   type:"ema",
    //   linkedTo:"static",
    //   parems:{
    //     period:"14"
    //   }
    // })

    // const [oscillationsIndicators ,setoscillationsIndicators]=useState({
    //   type:"macd",
    //   linkedTo:"static",
    //   yAxis:2,
    // })
    
    
    const [custom,setcustom]=useState(0);

    const [load,setload]=useState(false);
    const [load2,setload2]=useState(false);

    const about = useRef(null)
    const analysis = React.useRef(null)
    const finance = React.useRef(null)
    const refchart = React.useRef(null)
    const refnews = React.useRef(null)
    
    const [chartRange, setChartRange] = useState(null);
    const [prevprive,setprevprice] = useState()

    const test = React.useRef()
    const col = React.useRef()

    const date = new Date()
    let currdate = date.toJSON()

    const handleVisibilityChange = (isVisible) => {
      if (isVisible && !chartVisible && separatechart.length>0 ) {
        setChartVisible(true);
      }
    };
  
    const handleVisibilityChange2 = (isVisible) => {
      if (isVisible && !chartVisible2 && growthData.length>0) {
        setChartVisible2(true);
      }
    };
  
    const handleVisibilityChange3 = (isVisible) => {
      if (isVisible && !chartVisible3 && somedata.length>0) {
        setChartVisible3(true);
      }
    };
    //const barlabels = [...somedata.map(data=>data.Date),currdate.slice(0,10)]

    function travelSpecific(e){
      router.push(`/stocks/chart/${e}`)
    }
  const areachart = {
    chart:{
      style:{
        backgroundColor:isDark ? "#16181A" : "#ECEDEE"
      }
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
    selected:null
  },navigator:{
    enabled:false
  },
    series: [
      {
        name: scriptAllData.longName,
        type:"areaspline",
        showInNavigator: true,
        data: separatechart.map(obj=>
          [new Date(obj.Date).getTime(),obj.Close]
        ),
        tooltip: {
          valueDecimals: 2
        },
        fillColor: {
          linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
          },
          stops: [
              [0, "#6A0DAD"],
              [1, "ABA9AD"]
          ]
      },
      color:"#6A0DAD",
      
      },
      
      
      
    ],
    yAxis:[
      {
        gridLineWidth: 0,
      }
    ],
    tooltip: {
    
      shadow: true,
      backgroundColor:  isDark ? "#16181A" : "#FFFFFF",
      style: {
        color:  isDark ? "#FFFFFF" : "#16181A"
      },
    },
    
  };




  const candlestick ={
    chart:{
      animation: true,
      style:{
        backgroundColor:isDark ? "#16181A" : "#ECEDEE"
      }
    },
      rangeSelector: {
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
      
    },
    navigator:{
      enabled:false
    },
  
    series: [
      {
        type: 'candlestick',
        name: scriptAllData.longName,
        id: "static",
        data: somedata.map(obj=>
          [new Date(obj.Date).getTime(),obj.Open,obj.High,obj.Low,obj.Close]
        )
        //,[new Date(currdate.slice(0,10)).getTime(),parseFloat((scriptData.open).split(',').join("")),scriptData.high,scriptData.low,parseFloat(price.split(',').join(""))]
      ,
        color:"red",
        upColor:"lightgreen",
        yAxis:0,
        fillOpacity: 1, 
        color: 'lightgreen',
        upColor: 'red'
    },
    {
      type:"column",
      id: 'volume',
      name: 'Volume',
      data: somedata.map(obj=>
        [new Date(obj.Date).getTime(),obj.Volume]
       )
       //,[new Date(currdate.slice(0,10)).getTime(),parseFloat(scriptData.volume.split(',').join(""))]
      ,
      yAxis: 1,
      tooltip: {
        valueDecimals: 0, // Set the tooltip value decimals for the volume series
      },
      opacity: 0.5
    },

    
    
  ],
  tooltip: {
    
    shadow: true,
    backgroundColor:  isDark ? "#16181A" : "#FFFFFF",
    style: {
      color:  isDark ? "#FFFFFF" : "#16181A"
    },
  },
  yAxis:[
    
    {
      height: '100%',
      resize: {
        enabled: true
      },
      gridLineWidth: 0,
    },
    {
      top: '60%',
      height: '40%',
      resize: {
        enabled: true
      },
      gridLineWidth: 0,
     
    }
    
  ],
  plotOptions: {
    series: {
      yAxis: 0, 
    },
  },
    };

  async function getChartData(script){
    
     await fetch("http://localhost:5000/longhistory/"+script + "/max/1d",{method:"GET"})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed:', response.status);
        }
      })
      .then(data => {
        setalldata(data)
        setsomedata(data)
        setseparatechart(data)
        setChartVisible(true);
        //console.log(data)
        // const processedData = data.map(value => isNaN(value) ? null : value);
        // console.log(data.fliter(obj=>{!isNaN(obj.ChangeInVolume) && !isNaN(obj.Growth)}))
      
      
      })
      .catch(error => {
        console.error('Error:', error);
      });

      await fetch("http://localhost:5000/longhistory/"+script + "/max/1wk",{method:"GET"})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed:', response.status);
        }
      })
      .then(data => {
        setgrowthData(data)
        setgrowthData2(data)
        console.log(data)
        // const processedData = data.map(value => isNaN(value) ? null : value);
        // console.log(data.fliter(obj=>{!isNaN(obj.ChangeInVolume) && !isNaN(obj.Growth)}))
      
      
      })
      .catch(error => {
        console.error('Error:', error);
      });
 
 
  }

  

  async function getAllData(script){
   
     await fetch("http://localhost:5000/info/"+script ,{method:"GET"})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed:', response.status);
        }
      })
      .then(data => {
        console.log(data)
        const fye = data.lastFiscalYearEnd
        const nfy = data.nextFiscalYearEnd
        const lastdiv = data.exDividendDate
        const lastsp = data.lastSplitDate
        const div = data.lastDividendDate
        const altered_fye = new Date(fye*1000).toLocaleDateString('en-US')
        const altered_nye = new Date(nfy*1000).toLocaleDateString('en-US')
        const altered_lastdiv = new Date(lastdiv*1000).toLocaleDateString('en-US')
        const altered_lastsp= new Date(lastsp*1000).toLocaleDateString('en-US')
        const altered_div= new Date(div*1000).toLocaleDateString('en-US')
        setscriptAllData({
          ...scriptAllData,
          fiftytwochange:"",
          addrA:data.address1,
          addrB:data.address2,
          auditRisk:data.auditRisk,
          avgtenVolume:data.averageVolume10days,
          avgVolume:data.averageVolume,
          avgDailyVolume:data.averageDailyVolume10Day,
          beta:data.beta,
          boardRisk:data.boardRisk,
          city:data.city,
          compensationRisk:data.compensationRisk,
          currentPrice:data.currentPrice,
          currentRatio:data.currentRatio,
          dayHigh:data.dayHigh,
          dayLow:data.dayLow,
          debtToEquity:data.debtToEquity,
          dividendRate:data.dividendRate,
          dividendYield:data.dividendYield,
          earningsGrowth:data.earningsGrowth,
          earningsQuarterlyGrowth:data.earningsQuarterlyGrowth,
          ebitda:data.ebitda || 0,
          ebitdaMargins:data.ebitdaMargins,
          enterpriseToEbitda:data.enterpriseToEbitda,
          enterpriseToRevenue:data.enterpriseToRevenue,
          enterpriseValue:data.enterpriseValue ||0,
          exDividendDate:altered_lastdiv,
          exchange:data.exchange,
          fax:data.fax || "Not Provided",
          fiftyDayAverage:data.fiftyDayAverage,
          fiftyTwoWeekHigh:data.fiftyTwoWeekHigh,
          fiftyTwoWeekLow:data.fiftyTwoWeekLow,
          fiveYearAvgDividendYield:data.fiveYearAvgDividendYield,
          floatShares:data.floatShares || 0,
          freeCashflow:data.freeCashflow || 0,
          governanceEpochDate:data.governanceEpochDate,
          grossMargins:data.grossMargins,
          heldPercentInsiders:data.heldPercentInsiders,
          heldPercentInstitutions:data.heldPercentInstitutions,
          impliedSharesOutstanding:data.impliedSharesOutstanding,
          industry:data.industry,
          lastDividendDate:altered_div,
          lastDividendValue:data.lastDividendValue,
          lastFiscalYearEnd:altered_fye,
          lastSplitDate:altered_lastsp,
          lastSplitFactor:data.lastSplitFactor,
          longBusinessSummary:data.longBusinessSummary,
          longName:data.longName,
          marketCap:data.marketCap,
          open:data.open,
          operatingCashflow:data.operatingCashflow || 0,
          operatingMargins:data.operatingMargins,
          overallRisk:data.overallRisk,
          nextFiscalYearEnd:altered_nye,
          phone:data.phone,
          prevClose:data.previousClose,
          payoutRatio:data.payoutRatio,
          priceToSalesTrailing12Months:data.priceToSalesTrailing12Months,
          profitMargins:data.profitMargins,
          pe:data.forwardPE,
          type:data.quoteType,
          returnOnAssets:data.returnOnAssets,
          returnOnEquity:data.returnOnEquity,
          revenueGrowth:data.revenueGrowth,
          revenuePerShare:data.revenuePerShare,
          sector:data.sector,
          symbol:data.symbol,
          shareHolderRightsRisk:data.shareHolderRightsRisk,
          totalCash:data.totalCash || 0,
          totalCashPerShare:data.totalCashPerShare,
          totalDebt:data.totalDebt || 0,
          totalRevenue:data.totalRevenue || 0,
          trailingAnnualDividendRate:data.trailingAnnualDividendRate,
          trailingAnnualDividendYield:data.trailingAnnualDividendYield,
          trailingPE:data.trailingPE,
          twoHundredDayAverage:data.twoHundredDayAverage,
          volume:data.volume,
          website:data.website,
          zip:data.zip


        })
      })
      .catch(error => {
        console.error('Error:', error);
      });
   
  }

  
    async function getPrice(script){
        //e.preventDefault()
        try {
            //const body = {script};
            const response = await fetch("http://localhost:5000/price/"+ pathname.slice(8,),{
                method:"GET",
                headers:{"Content-Type":"application/json"},
                //body:JSON.stringify(body)
            })

            const res = await response.json();
            setprice(res.price);
            
         
              //setload(true)
            
              
            
            //console.log("called")

        }catch(err){
            console.error(err.message);
        }
            
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
            setscriptname(res.name)
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
            
            //console.log("called")

        }catch(err){
            console.error(err.message);
        }
  }

  async function getDescription(script){
    try {
        const body = {script};
        const response = await fetch("http://localhost:5001/profile",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(body)
        })

        const res = await response.json();
        setscriptProfile({
            ...scriptProfile,
            sector:res.sector,
            industry:res.industry,
            des:res.description
        })
        //console.log("called")

    }catch(err){
        console.error(err.message);
    }
  }

  

  async function getNews(script){
    
    await fetch("http://localhost:5000/news/"+script ,{method:"GET"})
     .then(response => {
       if (response.ok) {
         return response.json();
       } else {
         throw new Error('Request failed:', response.status);
       }
     })
     .then(data => {
       setnews(abc=>{
        const kbc = data.map(zzz=>{
          if (zzz.thumbnail && zzz.thumbnail.resolutions && zzz.thumbnail.resolutions.length > 0) {
            const { resolutions } = zzz.thumbnail;
            const { url } = resolutions[0];
            return <Newsbox
            key = {url}
            img = {url}
            title= {zzz.title}
            date ={zzz.providerPublishTime}
            des={zzz.publisher}
            link={zzz.link}
        />
          }
         
        })
        return kbc
         
       })
       console.log(data)
       
     })
     .catch(error => {
       console.error('Error:', error);
     });

 }


  function checkProfit(){
      if((price - scriptAllData.prevClose)>=0){
        setload2(true)
      }else{
        setload2(false)
      }
  }

  const setcol=(criteria)=>{
    if(criteria ===100){
      col.current.classList.add('ticking-background-up');
      const timer = setTimeout(() => {
        col.current.classList.remove('ticking-background-up');
      }, 1000);
      return () => clearTimeout(timer);
    }else if(criteria===200){
      col.current.classList.add('ticking-background-down');
      const timer = setTimeout(() => {
        col.current.classList.remove('ticking-background-down');
      }, 1000);
      return () => clearTimeout(timer);
    }else{
      return
    }

  }

 


  const chartConfig = {
    chart: {
      type: 'column',
      animation: true,
      style:{
        backgroundColor:isDark ? "#16181A" : "#ECEDEE"
      }
    },
    xAxis: {
      type: 'datetime'
    },
    title: {
      text: 'Monthly Growth and Supply/Demand Analysis',
      style: {
        color: isDark ? "#FFFFFF" : "#16181A",
      },
    },
    navigator:{
      enabled:false
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
      selected:null
    },
   
    yAxis: 
     [
        {
          height: '60%',
          resize: {
            enabled: true
          },
          gridLineWidth:0
        },
        {
          opposite:false,
          top: '20%',
          height: '40%',
          resize: {
            enabled: true
          },
          gridLineWidth:0
         
        },
        {
          top: '60%',
          height: '20%',
          resize: {
            enabled: true
          },
          gridLineWidth:0
         
        },
        {
          top: '80%',
          height: '20%',
          resize: {
            enabled: true
          },
          gridLineWidth:0
         
        }
        
      ]

    ,
    tooltip: {
    
      shadow: true,
      backgroundColor:  isDark ? "#16181A" : "#FFFFFF",
      style: {
        color:  isDark ? "#FFFFFF" : "#16181A"
      },
    },
    series: [
      {
        type: 'candlestick',
        name: scriptAllData.longName,
        id: "static",
        data: growthData2.map(obj=>
          [new Date(obj.Date).getTime(),(obj.Open).toFixed(2),obj.High,obj.Low,obj.Close]
        ),
        dataGrouping: {
          enabled: false
        },
        tooltip: {
          valueDecimals: 2
        },
        states: {
          hover: {
            lineWidth: 2
          }
        },
        color: 'red',
        upColor: 'lightgreen',
        yAxis:0
      },{
        type:"column",
        id: 'volume',
        name: 'Volume',
        data: growthData2.map(obj=>
          [new Date(obj.Date).getTime(),obj.Volume]
         )
         //,[new Date(currdate.slice(0,10)).getTime(),parseFloat(scriptData.volume.split(',').join(""))]
        ,
        yAxis: 1,
        tooltip: {
          valueDecimals: 0, // Set the tooltip value decimals for the volume series
        },
        opacity: 0.5
      },
      {
      type:"column",
      id: 'growth',
      name: 'Growth Percentage',
      data: growthData2.map(obj=>
        [new Date(obj.Date).getTime(),obj.Growth]
       )
       //,[new Date(currdate.slice(0,10)).getTime(),parseFloat(scriptData.volume.split(',').join(""))]
      ,
      yAxis: 2,
      tooltip: {
        valueDecimals: 0, // Set the tooltip value decimals for the volume series
      },
      opacity: 1
    }, {
      type:"column",
      id: 'volumePercentage',
      name: 'Supply/Demand Percentage',
      data: growthData2.map(obj=>
        [new Date(obj.Date).getTime(),obj.ChangeInVolume]
       )
       //,[new Date(currdate.slice(0,10)).getTime(),parseFloat(scriptData.volume.split(',').join(""))]
      ,
      yAxis: 2,
      tooltip: {
        valueDecimals: 0, // Set the tooltip value decimals for the volume series
      },
      opacity: 1
    },{
          type: 'ad',
          linkedTo: "static",
          yAxis: 3,
          params: {
              period: 3,
              volumeSeriesID: 'volume'
          }
        },]
  };

  async function getUserData(){
    try {
        const token = localStorage.getItem("sessionToken")
        const response = await fetch("http://localhost:5002/getData",{
            method:"POST",
            headers: { Authorization: `Bearer ${token}`,
                sessionToken: token
            },
        })
  
        const res = await response.json();
        if(!response.ok){
          return alert("Not workin")
        }
        console.log(res.user_name)
        setUserData({...userData,
          user_name:res.map(abc=>abc.user_name.slice(0,1)),
          email:res.map(abc=>abc.email)
        })
        setload(true)
    } catch (error) {
        console.error(error.message)
    }
  }

  useEffect(()=>{
  const script = pathname.slice(8,);
  
      
      getPrice(script)
      getStaticData(script)
      getDescription(script)
      getAllData(script)
      getChartData(script)
      getNews(script)
      //getGrowth(script)
      //setcandlestick(candlestick)
      //setnewchart(abc=>candlestick("ema","macd","stochastic"))
      //setnewchart(abc=>candlestick())
      console.log(localStorage.getItem("theme"))
      

    if (typeof window !== 'undefined') {
      if(localStorage.getItem("sessionToken")!=="" ){
        getUserData()
      }else{
        return
      }
    }
    
    const interval = setInterval(async () => {
      
          try {
              // const body = {script};
              const response = await fetch("http://localhost:5000/price/"+pathname.slice(8,),{
                  method:"GET",
                  headers:{"Content-Type":"application/json"},
                  //body:JSON.stringify(body)
              })

  
              const res = await response.json();
              setprevprice(price)
              console.log(res.price > price)
              if((res.price > price)){
                  setcol(100)
              }else if((res.price < price)){
                  setcol(200)
              }else{

              }
              setprice(res.price);
  
              checkProfit()
              console.log(prevprive)
            
              
              console.log("called",res)

          }catch(err){
              console.error(err.message);
          }
      }, 60000);
      
      return()=>{
          clearInterval(interval)
      }
    

  },[isDark])

  useEffect(()=>{
    if (typeof window !== 'undefined') {
      if(localStorage.getItem("theme")==="true"){
        setIsDark(true)
      }else if(localStorage.getItem("theme")==="false"){
        setIsDark(false)
      }else{
        return
      }
    }
  },[isDark])

 



 
    return(
      <NextThemesProvider
      defaultTheme="system"
      attribute="class"
      value={{
        light: lightTheme.className,
        dark: darkTheme.className
      }}
    >
      <NextUIProvider theme={isDark ? darkTheme : lightTheme}>
  
      <div className='totalscriptpage'>
      <Navbar shouldHideOnScroll isBordered variant={"floating"} css={{width:"100%", backgroundColor:"$background"}}>
      <Navbar.Toggle showIn="xs" aria-label="toggle navigation" />
      <Navbar.Brand>
        <box-icon name='trending-up' color='#1aae30' ></box-icon>
        <Text b>GrowthIN</Text>
          
        </Navbar.Brand>
        <Navbar.Content hideIn="xs">
          <Navbar.Link onClick={abc=>about.current.scrollIntoView({ behavior: 'smooth' })}>About</Navbar.Link>
          <Navbar.Link onClick={abc=>analysis.current.scrollIntoView({ behavior: 'smooth' })}>Tecnical Analysis</Navbar.Link>
          <Navbar.Link onClick={abc=>finance.current.scrollIntoView({ behavior: 'smooth' })}>Finance</Navbar.Link>
          <Navbar.Link onClick={abc=>refchart.current.scrollIntoView({ behavior: 'smooth' })}>Chart</Navbar.Link>
          <Navbar.Link onClick={abc=>refnews.current.scrollIntoView({ behavior: 'smooth' })}>News</Navbar.Link>
          {!load && <Navbar.Link color="inherit" href="#">
          <Link href={'/signup'}>Signup</Link>
          </Navbar.Link>}
          {load ?  
          <Dropdown placement="bottom-left">
          <Dropdown.Trigger>
              <Avatar
              color="default"
              bordered
              text={(userData.user_name).slice(0,2)}
              zoomed
              size="md"
            />
          </Dropdown.Trigger>
          <Dropdown.Menu color="default" aria-label="Avatar Actions">
            <Dropdown.Item key="profile" css={{ height: "$18" }}>
              <Text b color="inherit" css={{ d: "flex" }}>
                Signed in as
              </Text>
              <Text b color="inherit" css={{ d: "flex" }}>
                {userData.email}
              </Text>
              </Dropdown.Item>
              <Dropdown.Item key="settings" withDivider>
                My Settings
              </Dropdown.Item>
              <Dropdown.Item key="team_settings">Team Settings</Dropdown.Item>
              <Dropdown.Item key="analytics" withDivider>
                Analytics
              </Dropdown.Item>
              <Dropdown.Item key="system">System</Dropdown.Item>
              <Dropdown.Item key="configurations">Configurations</Dropdown.Item>
              <Dropdown.Item key="help_and_feedback" withDivider>
                Help & Feedback
              </Dropdown.Item>
              <Dropdown.Item key="logout" color="error" withDivider css={{textAlign:"start" ,paddingRight:"100px",display:"flex"}}>
                
                  <Button onClick={abc=>location.reload()} size="xs" color="error" light css={{ fontSize:"$md",marginRight:"$1"}}>Logout</Button>
                  
                
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
            
            : 
            <Navbar.Item>
              <Button auto flat href="#">
              <Link href={'/login'}>Login</Link>
              </Button>
            </Navbar.Item>}
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
        <Navbar.Collapse>
          <Navbar.CollapseItem>
            <Button light color="default" auto onClick={abc=>about.current.scrollIntoView({ behavior: 'smooth' })}>About</Button>
          </Navbar.CollapseItem>
          <Navbar.CollapseItem>
            <Button light color="default" auto onClick={abc=>analysis.current.scrollIntoView({ behavior: 'smooth' })}>Tecnical Analysis</Button>
          </Navbar.CollapseItem>
          
          <Navbar.CollapseItem>
            <Button light color="default" auto onClick={abc=>finance.current.scrollIntoView({ behavior: 'smooth' })}>Finance</Button>
          </Navbar.CollapseItem>

          <Navbar.CollapseItem>
           <Button light color="default" auto onClick={abc=>refchart.current.scrollIntoView({ behavior: 'smooth' })}>Chart</Button>
          </Navbar.CollapseItem>

            <Navbar.CollapseItem>
            <Button light color="default" auto onClick={abc=>refnews.current.scrollIntoView({ behavior: 'smooth' })}>News</Button>
          </Navbar.CollapseItem>
          
          <Navbar.CollapseItem>
          {!load && <Button light auto color="default" >
          <Link href={'/signup'}>Signup</Link>
          </Button>}
          </Navbar.CollapseItem>

          <Navbar.CollapseItem>
          {load ?  
          <Dropdown placement="bottom-left">
          <Dropdown.Trigger>
              <Avatar
              color="default"
              bordered
              text={(userData.user_name).slice(0,2)}
              zoomed
              size="md"
            />
          </Dropdown.Trigger>
          <Dropdown.Menu color="default" aria-label="Avatar Actions">
            <Dropdown.Item key="profile" css={{ height: "$18" }}>
              <Text b color="inherit" css={{ d: "flex" }}>
                Signed in as
              </Text>
              <Text b color="inherit" css={{ d: "flex" }}>
                {userData.email}
              </Text>
              </Dropdown.Item>
              <Dropdown.Item key="settings" withDivider>
                My Settings
              </Dropdown.Item>
              <Dropdown.Item key="team_settings">Team Settings</Dropdown.Item>
              <Dropdown.Item key="analytics" withDivider>
                Analytics
              </Dropdown.Item>
              <Dropdown.Item key="system">System</Dropdown.Item>
              <Dropdown.Item key="configurations">Configurations</Dropdown.Item>
              <Dropdown.Item key="help_and_feedback" withDivider>
                Help & Feedback
              </Dropdown.Item>
              <Dropdown.Item key="logout" color="error" withDivider css={{textAlign:"start" ,paddingRight:"100px",display:"flex"}}>
                
                  <Button  onClick={abc=>logout()} size="xs" color="error" light css={{ fontSize:"$md",marginRight:"$1"}}>Logout</Button>
                  
                
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
            
            : 
            
              <Button light color="default" size="md" auto flat href="#">
              <Link href={'/login'}>Login</Link>
              </Button>
            }

          </Navbar.CollapseItem>
      </Navbar.Collapse>
      </Navbar>
     
     <div className='superchart'>
     <Avatar squared size="md" onClick={abc=>travelSpecific('^NSEBANK')} icon={<box-icon name='link-external' color={isDark?"#FFFFFF" : "#16181A"}></box-icon>}></Avatar>

      </div>
      <div className='topmainchart' >
      {alldata.length> 0 ? 
          <ScriptChart 
          uniqueID = "7"
          data= {alldata}
          name="Nifty 50"
          isDark = {isDark}
          height="650px"
          strokeWidth="2"
          /> :
          <div style={{width:"100%", height:"100vh", display:'flex',justifyContent:'center',alignItems:"center"}}>
            <Loading size='lg' color="success"></Loading>
            </div>  
        }
      </div>

      <div className='mainscriptdata'>
        <div className='innermainscriptdata'>
         
         <div style={{display:"flex"}}>
         <h2>{scriptAllData.longName}.</h2>

         </div>
          
              <h1 className='price' ref={col}><b>₹{price}</b></h1>
              <div className='profit'>
                {load2 ? <div><Image src={up}></Image></div> : <div><Image src={down}></Image></div>}
              <h2>{(price - scriptAllData.prevClose).toFixed(2)} / </h2>
              <h2> {(((price - scriptAllData.prevClose)/scriptAllData.prevClose)*100).toFixed(2)}%</h2>
              
              </div>
         
          
        
       
        </div>
     
      </div>

      <br></br>
      <br></br>
<br></br>
<br></br>

      <h3><b>Summary</b></h3>
      <div className='subinfo'>
        
              <p>Previous Close: {(scriptAllData.prevClose)?.toLocaleString('en-US')}</p>
              <p>Range: {(scriptAllData.dayLow)?.toLocaleString('en-US')} - {(scriptAllData.dayHigh).toLocaleString('en-US')}</p>
              <p>Volume: {(scriptAllData.volume)?.toLocaleString('en-US')}</p>
              <p>PE Ratio: {(scriptAllData.pe)?.toLocaleString('en-US')}</p>
              <p>52 week range: {(scriptAllData.fiftyTwoWeekLow)?.toLocaleString('en-US')} - {(scriptAllData.fiftyTwoWeekHigh)?.toLocaleString('en-US')}</p>
              <p>Cap: {(scriptAllData.marketCap)?.toLocaleString('en-US')}</p>
              </div>
    
    
        <div className='about' ref={about}>
                <h3><b>About</b></h3>
                <hr></hr>
                <div className='subabout'>
                <li>Address: {scriptAllData.addrA} / {scriptAllData.addrB}</li>
                <li>Zip : {scriptAllData.zip}</li>
                <li>Sector: {scriptAllData.sector}</li>
                <li>Industry: {scriptAllData.industry}</li>
                <li>Fax: {scriptAllData.fax}</li>
                <li>Phone No: {scriptAllData.phone}</li>
                </div>
                
                <br></br>
                <p>{scriptAllData.longBusinessSummary}</p>
                <p>Website URL - <a href={scriptAllData.website}>{scriptAllData.website}</a></p>
            
            </div>

            <div className='analysis' ref={analysis}>
              <h1><b>Analysis</b></h1>
              <hr></hr>
              <div className='analysisContent'>
              <VisibilitySensor onChange={handleVisibilityChange2}>
                    <div className='subindicesChart'>
                    {chartVisible2 ?  <HighchartsReact
                        highcharts={Highcharts}
                        constructorType={'stockChart'}
                        options={chartConfig}
                        containerProps={{ style: { height: '90vh' } }}
                      />  : 
                      <Skeleton animation='wave' variant="rounded" width={1735} height={800} />
                      }
           
          
                      </div>
              </VisibilitySensor>
              
              </div>
            </div>
        <div className='finance' ref={finance}>
          <h1><b>Finance</b></h1>
          <hr></hr>
            <div className='ficat'>
           
              
              <div className='cat2'>
              <h2>Financial Overview</h2>
              <hr></hr>
                <div className='wrapsubcat2'>
                    <div className='subcat2' >
                        <h3>Fiscal Year</h3>
                        <li>Fiscal Year Ends : {scriptAllData.lastFiscalYearEnd}</li>
                        <li>Most Recent Quarter : {scriptAllData.nextFiscalYearEnd}</li>
                    
                    
                    </div>
                    <div className='subcat2'>
                        <h3>Profitability</h3>
                        <li>Profit Margin : {scriptAllData.profitMargins}%</li>
                        <li>Operating Margin : {scriptAllData.operatingMargins}%</li>
                    </div>
                    <div className='subcat2'>
                        <h3>Management Effectiveness</h3>
                        <li>Return on Assets : {scriptAllData.returnOnAssets}%</li>
                        <li>Return on Equity : {scriptAllData.returnOnEquity}%</li>
                    </div>
                    <div className='subcat2'>
                        <h3>Income Statement</h3>
                        <li>Revenue : {(scriptAllData.totalRevenue).toLocaleString('en-US')}</li>
                        <li>Revenue Per Share : {scriptAllData.revenuePerShare}</li>
                        <li>Profit Margins: {scriptAllData.profitMargins}</li>
                        <li>EBITDA : {(scriptAllData.ebitda).toLocaleString('en-US')}</li>
                        <li>EBITDA Margins: {scriptAllData.ebitdaMargins}</li>
                        <li>Quarterly Earnings Growth : {scriptAllData.earningsQuarterlyGrowth}</li>
                        <li>Quarterly Revenue Growth : {scriptAllData.revenueGrowth}%</li>
                    </div>
                    <div className='subcat2'>
                        <h3>Balance Sheet</h3>
                        <li>Total Cash : {(scriptAllData.totalCash).toLocaleString('en-US')}</li>
                        <li>Total Cash Per Share : {scriptAllData.totalCashPerShare}</li>
                        <li>Total Debt : {(scriptAllData.totalDebt).toLocaleString('en-US')}</li>
                        <li>Total Debt/Equity{scriptAllData.debtToEquity}</li>
  
                    </div>
                    <div className='subcat2'>
                        <h3>Cash Flow Statement</h3>
                        <li>Opearting Cash Flow : {(scriptAllData.operatingCashflow).toLocaleString('en-US')}</li>
                        <li>Operating Cash Flow Margins{scriptAllData.operatingMargins}</li>
                        <li>Leveraged Free Cash Flow : {(scriptAllData.freeCashflow).toLocaleString('en-US')}</li>
                    
                    </div>
                </div>
                
              </div>
            
            
            
              <div>
                  <div className='cat1'>
                    <h2>Valuation Measures</h2>
                    <hr></hr>
                    <li>Market Cap : {(scriptAllData.marketCap).toLocaleString('en-US')}</li>
                    <li>Enterprise Value : {(scriptAllData.enterpriseValue).toLocaleString('en-US')}</li>
                    <li>Trailing P/E : {scriptAllData.trailingPE}</li>
                    <li>Price/Sales : {scriptAllData.priceToSalesTrailing12Months}</li>
                    <li>Enterprise Value/Revenue : {scriptAllData.enterpriseToRevenue}</li>
                    <li>Enterprise Value/EBITDA : {scriptAllData.enterpriseToEbitda}</li>
      
                  
                  </div>
                  <br></br><br></br>
                  <div className='cat3'>
                      <h2>Trading Insight</h2>
                      <hr></hr>
                      <div className='subcat3'>
                          <h3>History</h3>
                          <li>Beta : {scriptAllData.beta}</li>
                          <li>52-Week Change : {scriptAllData.fiftytwochange}</li>
                          <li>52-Week High : {scriptAllData.fiftyTwoWeekHigh}</li>
                          <li>52-Week Low : {scriptAllData.fiftyTwoWeekLow}</li>
                          <li>50-Day Avg : {scriptAllData.fiftyDayAverage}</li>
                          <li>200-Day Avg : {scriptAllData.twoHundredDayAverage}</li>

                      </div>
                      <div className='subcat3'>
                          <h3>Statistics</h3>
                          <li>Avg Volume(3M) : {(scriptAllData.avgVolume).toLocaleString('en-US')}</li>
                          <li>Avg Volume(10D) : {(scriptAllData.avgtenVolume).toLocaleString('en-US')}</li>
                          <li>Float Shares : {(scriptAllData.floatShares).toLocaleString('en-US')}</li>
          



                      </div>
                      <div className='subcat3'>
                          <h3>Dividends & Splits</h3>
                        
                          <li>Trailing Annual Dividend Rate : {scriptAllData.trailingAnnualDividendRate}</li>
                          <li>Trailing Annual Dividend Yield : {scriptAllData.trailingAnnualDividendYield}</li>
                          <li>5 Year Average Dividend Yield : {scriptAllData.fiveYearAvgDividendYield}</li>
                          <li>Payout Ratio : {scriptAllData.payoutRatio}</li>
                          <li>Dividend Date : {scriptAllData.lastDividendDate}</li>
                          <li>Last Split Date : {scriptAllData.lastSplitDate}</li>
                          <li>Last Split Facto : {scriptAllData.lastSplitFactor}</li>
                          <li>Ex-Dividend Date : {scriptAllData.exDividendDate}</li>
                      </div>
                  </div>
              </div>
            </div>
        </div>
        <div className='chartcontent' ref={refchart}>
        <h1><b>Chart</b></h1>
        <hr></hr>
        
        <div className='guiforcharts'>
          
         <div className='sepcharts'>
        
              <VisibilitySensor onChange={handleVisibilityChange3}>
                    <div className='subindicesChart'>
                    {chartVisible3 ?  <HighchartsReact
                        highcharts={Highcharts}
                        constructorType={'stockChart'}
                        options={candlestick}
                        containerProps={{ style: { height: '90vh' } }}
                      />  : 
                      <Skeleton animation='wave' variant="rounded" width={1735} height={800} />
                      }
           
          
                      </div>
              </VisibilitySensor>
                
              
            </div>
          </div>
          
        </div>

        <div className='allnews' ref={refnews}>

          <h1><b>News</b></h1>
          <hr></hr>
          <br></br>
          <div className='newslay'>
                  {news}
          </div>
        </div>

        <div className='timedetails'>
            <small>Last Updated : {Date()}</small>
            <br></br>
            <small>Data by <b>Yahoo Finance</b></small>
        </div>
            <br></br>
        
        
       
    </div>

    </NextUIProvider>
    </NextThemesProvider>
    )
}


