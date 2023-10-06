"use client"
import React,{useState,useEffect} from 'react'
import { usePathname, useSearchParams } from 'next/navigation';
import PredictionCharts from '../../../../../components/charts/PredictionChart'
import {Loading} from '@nextui-org/react';

export default function Prediction(){

    const path = usePathname()
    const [first_full_rsi,setfirst_full_rsi] = useState([])
    const [second_full_rsi,setsecond_full_rsi] = useState([])
    const [first_full_prediction,setfirst_full_prediction] = useState([])
    const [second_full_prediction,setsecond_full_prediction] = useState([])

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
            //const first_split_prediction = JSON.parse(res.first_split_predictions);
            //const second_split_prediction = JSON.parse(res.second_split_predictions);

            setfirst_full_rsi(first_split_rsi)
            setsecond_full_rsi(second_split_rsi)
           // setsecond_full_prediction()
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(()=>{
        console.log(path.slice(20))
        getData(path.slice(20))
    },[])
    return (
        <div style={{display:'block'}}>
            {first_full_rsi.length !== 0 ? <PredictionCharts
                uniqueID ='8'
                data={first_full_rsi}
                name="Nifty"
                height="320px"
            /> :<Loading color="success" size="md"/> }
            {second_full_rsi.length !== 0 ? <PredictionCharts
                uniqueID ='9'
                data={second_full_rsi}
                name="Nifty"
                height="320px"
            /> :<Loading color="success" size="md"/> }
        </div>
    )
}