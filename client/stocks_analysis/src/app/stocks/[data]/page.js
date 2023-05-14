"use client"
import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
  } from 'chart.js';
import { Chart,Bar,Line } from 'react-chartjs-2';

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController
  );
import "./data.css"
export default function SingleStock(){

    var axios = require('axios');
    const pathname = usePathname();
    const [scriptname,setscriptname] = useState("");
    const [price,setprice] = useState("");
    const [scriptData,setscriptData]=useState({
        prev:"",
        open:"",
        volume:"",
        cap:"",
        pe:""
    })

    const [scriptProfile,setscriptProfile] = useState({
        sector:"",
        industry:"",
        des:""
    })

    const [alldata,setalldata]=useState([])
    const [somedata,setsomedata]=useState(alldata)

    const [custom,setcustom]=useState(0);

    const [chart,setchart]=useState(true);
    const [rsi,setrsi]=useState([]);
    const [total,settotal]=useState(0)

    

    //console.log(sum)

    const barlabels = somedata.map(data=>data.Date)

    const bar = {
        labels:barlabels,
        datasets: [
          {
            fill: true,
            label: 'Volume',
            data: somedata.map(data=>data.Volume),
            borderColor: 'rgb(0,0,255)',
            backgroundColor: 'rgba(0,0,255, 0.5)',
          },
          
        ],
      };

    const options = {
        plugins: {
        title: {
            display: false,
            text: 'Chart.js Bar Chart - Stacked',
        },
        },
        responsive: true,
        scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
        },
        },
    };

    const stacklabels = somedata.map(data=>data.Date)

    const stack = {
        labels:stacklabels,
        datasets: [
          

          {
            
            label: 'Low',
            backgroundColor: 'rgba(255,0,0,0.5)',
            data: somedata.map(data=>data.Low),
            borderColor: 'rgba(255,0,0,0.5)',
            borderWidth: 2,
          },
          {
            label: 'Close',
            backgroundColor: 'rgb(255, 0, 0)',
            data: somedata.map(data=>data.Close),
            borderColor: 'rgba(255, 0, 0,0)',
            borderWidth: 1,
          },
          {
            label: 'Open',
            backgroundColor: 'rgb(0,255,0)',
            data: somedata.map(data=>data.Open),
            borderColor: 'rgba(0,255,0,0)',
            borderWidth: 1,
          },
          {
            label: 'High',
            backgroundColor: 'rgba(0,255,0,0.5)',
            data: somedata.map(data=>data.High),
            borderColor: 'rgba(0,255,0,0.5)',
            borderWidth: 2,
          },
          
        ],
      };

      const lineoptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Line Chart',
          },
        },
      };


      const line = {
        labels:stacklabels,
        datasets: [
          

         {
            
            label: 'Low',
            backgroundColor: 'rgb(0,0,255)',
            data: somedata.map(data=>data.Low),
            borderColor: 'rgba(0,0,255,0.5)',
            borderWidth: 2,
          },
          {
            label: 'Close',
            backgroundColor: 'rgb(255, 0, 0)',
            data: somedata.map(data=>data.Close),
            borderColor: 'rgba(255, 0, 0,0.5)',
            borderWidth: 1,
          },
          {
            label: 'Open',
            backgroundColor: 'rgb(0,255,0)',
            data: somedata.map(data=>data.Open),
            borderColor: 'rgba(0,255,0,0.5)',
            borderWidth: 1,
          },
          {
            label: 'High',
            backgroundColor: 'rgb(138,43,226)',
            data: somedata.map(data=>data.High),
            borderColor: 'rgba(138,43,226,0.5)',
            borderWidth: 2,
          },
          
        ],
      };

    async function getPrice(script){
        //e.preventDefault()
        try {
            const body = {script};
            const response = await fetch("http://localhost:5001/currentPrice",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(body)
            })

            const res = await response.json();
            setprice(res.price);
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
                    pe:res.PEratio
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

  async function getAllData(script){
    try {
        const body = {script};
        const response = await fetch("http://localhost:5000/history",{
            method:"POST",
            headers:{"Content-Type":"application/json",
            'Accept': 'application/json'},
            body:JSON.stringify(body)
        })

        const res = await response.text();
        //setalldata(res)
        const data = res.replace(/NaN/g,'null');

        const jsonData = JSON.parse(data)
        // const somedata = jsonData.slice(-30)
        //console.log(jsonData)
        setalldata(jsonData)
        setsomedata(jsonData)
        
        setrsi(jsonData)
        const ref = jsonData.slice(-15,-14).reduce(function(tot, arr) { 
          return (tot + arr.Close)
        },0)
        console.log(ref)
        const mysum = jsonData.slice(-14).reduce(function(tot, arr) { 
          
          return (tot+arr.Close)
        },0)

        const [first, second] = mysum

        console.log(mysum)
        // console.log(ref,mysum)
        // console.log(100 - 100/mysum)
        console.log(alldata.map(data=>data.Date))
        
        //console.log(jsonData)
        

    }catch(err){
        console.error(err.message);
    }
  }

  const customdata=(e)=>{
    e.preventDefault();
    setsomedata(alldata.slice(-custom))
  }

  useEffect(()=>{

  
    const script = pathname.slice(8,);
    getPrice(script)
    getStaticData(script)
    getDescription(script)
    getAllData(script)
    const interval = setInterval(async () => {
        try {
            const body = {script};
            const response = await fetch("http://localhost:5001/currentPrice",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(body)
            })

            const res = await response.json();
            setprice(res.price);
            console.log("called",res)

        }catch(err){
            console.error(err.message);
        }
    }, 10000);
    
    return()=>{
        clearInterval(interval)
    }

  },[])

    return(
        <div className='alldata'>
          <div className='stockinfo'>
            <div className='substockinfo'>
              <h1>{scriptname}</h1>
              <h1 className='price'>₹{price}</h1>
              <div className='subinfo'>
              <li>Previous Close: {scriptData.prev}</li>
              <li>Open: {scriptData.open}</li>
              <li>Volume: {scriptData.volume}</li>
              <li>Market Cap: {scriptData.cap}</li>
              <li>PE Ratio: {scriptData.pe}</li>
              </div>
            </div>
          
            

          <br></br>
           
            <div className='about'>
                <h2>About</h2>
                <div className='subabout'>
                <li>Sector: {scriptProfile.sector}</li>
                <li>Industry: {scriptProfile.industry}</li>
                </div>
                
                <br></br>
                <p>{scriptProfile.des}</p>
            </div>
          </div>
            
            

            <div className='charts'>
              <div className='chartbtn'>
              <button onClick={abc=>
                setsomedata(alldata.slice(-30))
                }>1M</button>
              <button onClick={abc=>
                setsomedata(alldata.slice(-90))
                }>3M</button>
              <button onClick={abc=>
                setsomedata(alldata.slice(-180))
                }>6M</button>
              <button onClick={abc=>
                setsomedata(alldata.slice(-365))
                }>1Y</button>
              <button onClick={abc=>
                setsomedata(alldata.slice(0))
                }>MAX</button>
                
                <form onSubmit={customdata}>
                <input 
                type='number'
                placeholder='25'
                value={custom}
                onChange={(e)=>setcustom(e.target.value)}
                ></input>
              <button 
                type='submit'
                >Custom</button>
                </form>

                <button onClick={abc=>setchart(true)}>Line Chart</button>
                <button onClick={abc=>setchart(false)}>Bar Chart</button>

              </div>

              <div className='subcharts'>
                  {chart ? <div className='linecharts'>
                <Line options={lineoptions} data={line}/>
                <br></br>
                <Line options={lineoptions} data={bar} />
                </div>
                  :
                <div>
                <Bar options={options} data={stack} />
                <br></br>
                <Bar data={bar}/>
                </div>}
              </div>
              
            


            </div>

            {/* <div className='data'>
            {Array.isArray(alldata) ? 
            (alldata.map(data => (
                <div key={data.Date}>
                <p>Date: {data.Date}</p>
                <p>Open: {data.Open}</p>
                <p>High: {data.High}</p>
                <p>Low: {data.Low}</p>
                <p>Close: {data.Close}</p>
                <p>Volume: {data.Volume}</p>
                </div>
                 )))
                 :
                 (<p>Loading....</p>)}
            </div> */}

            

            
        
        </div>
    )
}


