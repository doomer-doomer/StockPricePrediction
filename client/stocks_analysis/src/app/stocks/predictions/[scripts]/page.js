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

    const [fr2,setfr2] = useState([]);
    const [sr2,setsr2] = useState([]);
    const [fmse,setfmse] = useState([]);
    const [smse,setsmse] = useState([]);
    const[dir,setdir] = useState(true)

    const [timeoutElapsed, setTimeoutElapsed] = useState(true);

    async function getData(script){
        
            const fetchResponse = fetch(`http://localhost:5000/rsiPredictions/${script}`)
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => {
                setTimeoutElapsed(false);
              }, 60000); 
            });
            
            try {
              const response = await Promise.race([fetchResponse, timeoutPromise]);

              if(!response.ok){
                  return
              }
              const res = await response.json()
              
              const first_split_rsi = JSON.parse(res.first_split_rsi);
              const second_split_rsi = JSON.parse(res.second_split_rsi);
              const first_split_prediction = JSON.parse(res.first_predicted_values);
              const second_split_prediction = JSON.parse(res.second_split_predictions);
              const latest_prediction = JSON.parse(res.latest_30_day_pred);
              const first_r2= JSON.parse(res.fr2);
              const second_r2= JSON.parse(res.sr2);
              const first_mse= JSON.parse(res.fmse);
              const second_mse= JSON.parse(res.smse);
            
              const first_split_rsifilteredArray = first_split_rsi.filter(function(obj) {
                return !isNaN(obj.RSI);
            });
              const second_full_rsifilteredArray = second_split_rsi.filter(function(obj) {
    return !isNaN(obj.RSI);
});
              const first_split_predictionfilteredArray = first_split_prediction.filter(function(obj) {
    return !isNaN(obj.RSI);
});
              const second_split_predictionfilteredArray = second_split_prediction.filter(function(obj) {
    return !isNaN(obj.RSI);
});
              const latest_predictionfilteredArray = latest_prediction.filter(function(obj) {
    return !isNaN(obj.RSI);
});

              setfirst_full_rsi(first_split_rsifilteredArray)
              setsecond_full_rsi(second_full_rsifilteredArray)
              setfirst_full_prediction(first_split_predictionfilteredArray)
              setsecond_full_prediction(second_split_predictionfilteredArray)
              setlatest_30_prediction(latest_predictionfilteredArray)

              setfr2(first_r2)
              setsr2(second_r2)
              setfmse(first_mse)
              setsmse(second_mse)
              
        } catch (error) {
            console.log(error.message)
        }
    }

    function changeSides(){
      if(dir===true){
        setdir(false)
      }else{
        setdir(true)
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
        <div style={{width:"100%",height:'100vh',display:'flex'}}>

       

        <div style={{flex:'0.8'}}>
        {dir ? 
       
       <div style={{position:"relative",width:'100%',height:'100vh'}}>
       <h2 style={{position:'absolute',top:'5%',left:'50%',translate:'-50% -50%'}}>Comparitive Historical Prediction</h2>
       {first_full_rsi.length !==0 ? <h3 style={{position:'absolute',top:'51%',left:'50%',translate:'-50% -50%'}}>{first_full_rsi[0].Date.slice(0,4)}-{first_full_rsi[first_full_rsi.length-1].Date.slice(0,4)}</h3> : <div></div>}
       {second_full_rsi.length!==0 ? <h3 style={{position:'absolute',top:'97%',left:'50%',translate:'-50% -50%'}}>{second_full_rsi[0].Date.slice(0,4)}-{second_full_rsi[second_full_rsi.length-1].Date.slice(0,4)}</h3>: <div></div>}

       <div>
           <box-icon onClick={abc=>changeSides()} style={{position:'absolute',top:'5%',left:'90%',translate:'-50% -50%',zIndex:4}} type={dir ? 'solid' : ""} name='right-arrow' color={isDark?'#f7efef' : "#000000"}></box-icon>        
       </div>
       <box-icon onClick={abc=>changeSides()} style={{position:'absolute',top:'5%',left:'10%',translate:'-50% -50%',zIndex:4}} type={dir ? '' : "solid"} name='left-arrow' color={isDark ?'#f7efef' : "#000000"}></box-icon>
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
           /> :timeoutElapsed ? <Loading style={{height:'320px',display:'flex',justifyContent:'center',alignItems:'center'}} color="success" size="lg"/> : <div style={{height:'320px',display:'flex',justifyContent:'center',alignItems:'center'}}><h3>Something went wrong!</h3></div> }
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
           /> :timeoutElapsed ? <Loading style={{height:'320px',display:'flex',justifyContent:'center',alignItems:'center'}} color="success" size="lg"/> : <div style={{height:'320px',display:'flex',justifyContent:'center',alignItems:'center'}}><h3>Something went wrong!</h3></div> }
           </div>
           
       </div>
       </div>
       :
       <div style={{position:'relative',width:'100%',height:'100vh'}}>
       <h2 style={{position:'absolute',top:'5%',left:'50%',translate:'-50% -50%'}}>30 Day&apos;s Prediction</h2>
       <box-icon onClick={abc=>changeSides()} style={{position:'absolute',top:'5%',left:'90%',translate:'-50% -50%',zIndex:4}} type={dir ? '' : "solid"} name='right-arrow' color={isDark?'#f7efef' : "#000000"}></box-icon>        
       <div>
       <box-icon onClick={abc=>changeSides()} style={{position:'absolute',top:'5%',left:'10%',translate:'-50% -50%',zIndex:4}} type={dir ? 'solid' : ""} name='left-arrow' color={isDark?'#f7efef' : "#000000"}></box-icon>
       </div>
       <div>
           {second_full_rsi.length !== 0 && second_full_prediction.length !==0 ? <PredictionCharts
               uniqueID ='11'
               data={second_full_rsi}
               predictionData={latest_30_prediction}
               name="Nifty"
               height="640px"
               strokeWidth='2'
               isDark={isDark}
           /> :timeoutElapsed ? <Loading style={{height:'640px',display:'flex',justifyContent:'center',alignItems:'center'}} color="success" size="lg"/> : <div style={{height:'640px',display:'flex',justifyContent:'center',alignItems:'center'}}><h2>Something went wrong!</h2></div> }
           </div>
       </div>}
          </div>

          <div style={{flex:'0.2'}}>
          <h2 style={{marginTop:'10px'}}>Chart Analysis</h2>
          {first_full_rsi.length!==0 && second_full_rsi.length!==0 && first_full_prediction.length!==0 && second_full_prediction.length!==0 ?
            <div>
            <h4>Name : {path.slice(20)}</h4>
          <p>Total count : {first_full_rsi.length+second_full_rsi.length} days</p>
          <p>Split Ratio : 1:1</p>
          <p>Dataset : RSI / Date</p>
          <p>Prediction : RSI</p>
          <p>Data split ratio : 9:1</p>
          {fr2.length !==0 ? <p>R2 Score : {(fr2*100).toFixed(2)}%</p> : <div></div>}
          {fmse.length !==0 ? <p>MSE : {(fmse).toFixed(5)}</p> : <div></div>}
          <br></br>
          <p><b>Upper Analysis</b></p>
          <p>Range : {first_full_rsi[0].Date} to {first_full_rsi[first_full_rsi.length-1].Date}</p>
          <p>Total Count : {first_full_rsi.length} Days</p>
          <p>Prediction Count: {first_full_prediction.length} Days</p>
          
          <br></br>
          <p><b>Lower Analysis</b></p>
          <p>Range : {second_full_rsi[0].Date} to {second_full_rsi[second_full_rsi.length-1].Date}</p>
          <p>Total Count : {second_full_rsi.length} Days</p>
          <p>Prediction Count: {second_full_prediction.length} Days</p>
          
          <br></br>
            <div style={{display:'grid',gridTemplateColumns:'auto auto auto'}}>
              <div >
              <box-icon type='solid' name='checkbox' color='#ef476f' ></box-icon>
              <small style={{color:'#ef476f'}}>Training</small>
              </div>
              <div>
              <box-icon type='solid' name='checkbox' color='#ffd166' ></box-icon>
              <small style={{color:'#ffd166'}}>Testing</small>
              </div>
              <div>
              <box-icon type="solid" name='checkbox'  color='#06d6a0' ></box-icon>
              <small style={{color:'#06d6a0'}}>Validation</small>
              </div>
            </div>
          </div>
         
              :
          <div style={{width:'100%',height:'80%'}}>
              <Loading style={{height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}} color="success" size="lg"/>
          </div>
}
            
        </div>

       
        </div>
      
        </NextUIProvider>
        </NextThemesProvider>
        
    )
}