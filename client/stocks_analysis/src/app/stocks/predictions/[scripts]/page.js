"use client"
import React,{useState,useEffect} from 'react'
import { usePathname, useSearchParams } from 'next/navigation';
import PredictionCharts from '../../../../../components/charts/PredictionChart'
import {Loading} from '@nextui-org/react';
import { createTheme } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { NextUIProvider } from '@nextui-org/react';
import 'boxicons'

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

export default function Prediction(){

    const path = usePathname()
    const [isDark,setIsDark] = useState(false)
    const [first_full_rsi,setfirst_full_rsi] = useState([])
    const [second_full_rsi,setsecond_full_rsi] = useState([])
    const [first_full_prediction,setfirst_full_prediction] = useState([])
    const [second_full_prediction,setsecond_full_prediction] = useState([])
    const [latest_30_prediction,setlatest_30_prediction] = useState([])
    const[dir,setdir] = useState(true)

    async function getData(script){
        try {
            const resposne = await fetch(`http://localhost:5000/rsiPredictions/${script}`)
            if(!resposne.ok){
                return
            }
            const res = await resposne.json()
            console.log(res.first_split_rsi) 
            const first_split_rsi = JSON.parse(res.first_split_rsi);
            const second_split_rsi = JSON.parse(res.second_split_rsi);
            const first_split_prediction = JSON.parse(res.first_predicted_values);
            const second_split_prediction = JSON.parse(res.second_split_predictions);
            const latest_prediction = JSON.parse(res.latest_30_day_pred);

            setfirst_full_rsi(first_split_rsi)
            setsecond_full_rsi(second_split_rsi)
            setfirst_full_prediction(first_split_prediction)
            setsecond_full_prediction(second_split_prediction)
            setlatest_30_prediction(latest_prediction)
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(()=>{
        console.log(path.slice(20))
        getData(path.slice(20))
    },[])
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
      
       },[isDark,dir])
    return (
        <NextThemesProvider
      defaultTheme="system"
      attribute="class"
      value={{
        light: lightTheme.className,
        dark: darkTheme.className
      }}
    >
      <NextUIProvider theme={isDark ? darkTheme : lightTheme}>
        {dir ? 
        <div style={{position:"relative",width:'100%',height:'100vh'}}>
        <h1 style={{position:'absolute',top:'5%',left:'50%',translate:'-50% -50%'}}>20 Year&apos;s Prediction</h1>
        <div onClick={abc=>setdir(false)}>
            <box-icon style={{position:'absolute',top:'5%',left:'90%',translate:'-50% -50%'}} type={dir ? 'solid' : ""} name='right-arrow' color={isDark?'#f7efef' : "#000000"}></box-icon>        
        </div>
        <box-icon style={{position:'absolute',top:'5%',left:'10%',translate:'-50% -50%'}} type={dir ? '' : "solid"} name='left-arrow' color={isDark ?'#f7efef' : "#000000"}></box-icon>
        <div style={{display:'block'}}>
            <div style={{}}>
            {first_full_rsi.length !== 0 && first_full_prediction.length !==0 ? <PredictionCharts
                uniqueID ='8'
                data={first_full_rsi}
                predictionData={first_full_prediction}
                name="Nifty"
                height="320px"
                strokeWidth='2'
                isDark={isDark}
            /> :<Loading style={{height:'320px',display:'flex',justifyContent:'center',alignItems:'center'}} color="success" size="lg"/> }
            </div>
            <div>
            {second_full_rsi.length !== 0 && second_full_prediction.length !==0 ? <PredictionCharts
                uniqueID ='9'
                data={second_full_rsi}
                predictionData={second_full_prediction}
                name="Nifty"
                height="320px"
                strokeWidth='2'
                isDark={isDark}
            /> :<Loading style={{height:'320px',display:'flex',justifyContent:'center',alignItems:'center'}} color="success" size="lg"/> }
            </div>
            
        </div>
        </div>
:
        <div style={{position:'relative',width:'100%',height:'100vh'}}>
        <h1 style={{position:'absolute',top:'95%',left:'50%',translate:'-50% -50%'}}>30 Day&apos;s Prediction</h1>
        <box-icon  style={{position:'absolute',top:'5%',left:'90%',translate:'-50% -50%'}} type={dir ? '' : "solid"} name='right-arrow' color='#f7efef'></box-icon>        
        <div onClick={abc=>setdir(true)}>
        <box-icon style={{position:'absolute',top:'5%',left:'10%',translate:'-50% -50%'}} type={dir ? 'solid' : ""} name='left-arrow' color='#f7efef'></box-icon>
        </div>
        <div>
            {second_full_rsi.length !== 0 && second_full_prediction.length !==0 ? <PredictionCharts
                uniqueID ='9'
                data={second_full_rsi}
                predictionData={second_full_prediction}
                name="Nifty"
                height="320px"
                strokeWidth='2'
                isDark={isDark}
            /> :<Loading style={{height:'320px',display:'flex',justifyContent:'center',alignItems:'center'}} color="success" size="lg"/> }
            </div>
        </div>}
        
        </NextUIProvider>
        </NextThemesProvider>
        
    )
}