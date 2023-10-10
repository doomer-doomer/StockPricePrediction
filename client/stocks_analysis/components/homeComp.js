"use client"

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
// import Head from './head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import '../src/app/startpg.css'
import Image from 'next/image';
import Highcharts from 'highcharts/highstock';
//import HighchartsReact from 'highcharts-react-official';
import sand from 'highcharts/themes/sand-signika';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import {Loading} from '@nextui-org/react';
import Search from '@mui/icons-material/Search'

import {Dropdown} from "@nextui-org/react"
import { styled } from '@mui/material/styles';
import { Avatar } from '@nextui-org/react';

import { Navbar, Button, Text, Card, Radio, theme,Container, Row } from "@nextui-org/react";
import Up from '../src/app/arrow-up.png'
import Down from '../src/app/down.png'
import ScreenerDark from '../images/screener/ScreenerDark.jpg'
import ScreenerLight from '../images/screener/ScreenerLight.jpg'
import ChartDark from '../images/chart/ChartDark.png'
import ChartLight from '../images/chart/ChartLight.png'
import stock from '../src/app/stock';

import { NextUIProvider } from '@nextui-org/react';
import { Grid, Switch } from "@nextui-org/react";
import { SunIcon } from './sun';
import { MoonIcon } from './moon';

import { createTheme } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { useDraggable } from "react-use-draggable-scroll";

// import VisibilitySensor from 'react-visibility-sensor';
// import { Skeleton } from '@mui/material';

// import { UseSelector, useSelector } from 'react-redux/es/hooks/useSelector';
import BusinessNewsBox from '../src/app/newsBox';
import columns from '../src/app/columns';
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import CustomTable from './customTable';
import GeneralChart from './charts/GeneralChart';

const HighchartsReact = dynamic(() => import('highcharts-react-official'), {
  ssr: false, // This disables SSR for this component
});


const lightTheme = createTheme({
  type: 'light',
  
})

const darkTheme = createTheme({
  type: 'dark',
  colors:{
    modes: {
      dark: {
        background: '#16181A', // Set your desired background color here
        // ... other dark theme configuration
      },
    },
  }
  
})

sand(Highcharts);

export default function SSRfreeHome() {

  const yfinanceURL = "http://127.0.0.1:5000"

  const [script,setscript]=useState("");
  const [open, setOpen] = useState(false);
  const [nifty50Data,setnifty50Data] = useState([])
  const [bankData,setbankData] = useState([])
  const [healthData,sethealthData] = useState([])
  const [autoData,setautoData] = useState([])
  const [consumer50Data,setconsumer50Data] = useState([])
  const [financeNiftyData,setfinanceData] = useState([])
  const [energyData,setenergyData] = useState([])
  const [FMGCData,setFMGCData] = useState([])
  const [ITData,setITData] = useState([])
  const [MediaData,setMediaData] = useState([])
  const [Oil50Data,setOil50Data] = useState([])
  const [pharmaNiftyData,setpharmaData] = useState([])
  const [privateBankData,setprivateBankData] = useState([])
  const [realtyData,setrealtyData] = useState([])

  const [niftyIT,setNiftyIT] = useState([])
  const [niftyFinService,setniftyFinService] = useState([])


  const [NSEData,setNSEData] = useState([])
  const [BSEData,setBSEData] = useState([])
  const [AllIndex,setAllIndex]=useState(NSEData.concat(BSEData))

  const [bNews,setbusinessNews]=useState([])

  const [topgainers,setTopgainers] = useState([]);
  const [toplosers,setToplosers] = useState([]);

  const router = useRouter();

  const [data1,setdata1]= useState({
    high:"",
    low:"",
    open:"",
    prevClose:"",
    symbol:""
  })

  const [data2,setdata2]= useState({
    high:"",
    low:"",
    open:"",
    prevClose:"",
    symbol:""
  })

  const [data3,setdata3]= useState({
    high:"",
    low:"",
    open:"",
    prevClose:"",
    symbol:""
  })
  const[indices,setindices]=useState([])
  const [nifty,setnifty]=useState([])
  const [bank ,setbank] = useState([])
  const [sensex,setsensex] = useState([])

  const [userData,setUserData]=useState({
    user_name:"",
    email:""
  })
  const [isDark, setIsDark] = useState(false);
  const [testtheme, testsetTheme] = useState('light');
  const containers = useRef();
  const { events } = useDraggable(containers);

  const [load,setload] = useState(false)

  const handleChange = (e,value)=>{
    //e.preventDefault();
    setscript(value)
    console.log(value)
    //router.push(`/stocks/${value}`)
  }

  const travel = (e)=>{
    e.preventDefault()
    if(script===""){
      return alert("Select a Stock")
    }
    router.push(`/stocks/${script}`)
  }

  const travelSpecific = (e)=>{
    router.push(`/stocks/chart/${e}`)
  }

  const screener = (e)=>{
    router.push(`/stocks/screener`)
  }

  const supercharts = (e)=>{
    router.push(`/stocks/chart/^NSEI`)
  }

  const prediction = (e)=>{
    router.push("/stocks/predictions")
  }

  const [isMouseDown, setIsMouseDown] = useState(false);
    const mouseCoords = useRef({
        startX: 0,
        startY: 0,
        scrollLeft: 0,
        scrollTop: 0
    });
  const [isScrolling, setIsScrolling] = useState(false);
    const handleDragStart = (e) => {
        if (!containers.current) return
      const slider = containers.current.children[0];
        const startX = e.pageX - slider.offsetLeft;
        const startY = e.pageY - slider.offsetTop;
        const scrollLeft = slider.scrollLeft;
        const scrollTop = slider.scrollTop;
        mouseCoords.current = { startX, startY, scrollLeft, scrollTop }
        setIsMouseDown(true)
        document.body.style.cursor = "grabbing"
    }
    const handleDragEnd = () => {
        setIsMouseDown(false)
        if (!containers.current) return
        document.body.style.cursor = "default"
    }
    const handleDrag = (e) => {
        if (!isMouseDown || ! containers.current) return;
        e.preventDefault();
        const slider = containers.current.children[0];
        const x = e.pageX - slider.offsetLeft;
        const y = e.pageY - slider.offsetTop;
        const walkX = (x - mouseCoords.current.startX) * 1.5;
        const walkY = (y - mouseCoords.current.startY) * 1.5;
        slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;
        slider.scrollTop = mouseCoords.current.scrollTop - walkY;
        console.log(walkX, walkY)
    }


  const areachart2 = {
    rangeSelector: {
      selected: 5,
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
    chart:{
      style:{
        backgroundColor:isDark ? "black" : "white"
      }
    },
    navigator:{
      enabled:false
    },
    yAxis:[
      {
        gridLineWidth: 0,
      }
    ],
    series: [
      {
        name: "NIFTY BANK",
        type:"spline",
        data:bank.map(obj=>
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
              [0, "#63ff25"],
              [1, "ABA9AD"]
          ]
      },
      color:"#63ff25",
      }, 
    ],
  };

  const areachart3 = {
    rangeSelector: {
      selected: 5,
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
    chart:{
      style:{
        backgroundColor:isDark ? "black" : "white"
      },
      scrollbar: {
        enabled: false
      }
    },
    navigator:{
      enabled:false,
     
    },
    yAxis:[
      {
        gridLineWidth: 0,
      }
    ],
    series: [
      {
        name: "NIFTY 50",
        type:"spline",
        data:sensex.map(obj=>
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
              [0, "#fffc35"],
              [1, "ABA9AD"]
          ]
      },
      color:"#fffc35",
      }, 
    ],
  };


  const getIndices = async()=>{
    
      await fetch(yfinanceURL+"/longhistory/^NSEI/max/1d",{method:"GET"})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed:', response.status);
        }
      })
      .then(data => {
        setnifty(data)
        console.log(data)
      })
      .catch(error => {
        console.error('Error:', error);
      });

      await fetch(yfinanceURL+"/longhistory/^NSEBANK/max/1d",{method:"GET"})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed:', response.status);
        }
      })
      .then(data => {
        console.log(data)
        setbank(data)
        
      })
      .catch(error => {
        console.error('Error:', error);
      });
    
      await fetch(yfinanceURL+"/longhistory/^BSESN/max/1d",{method:"GET"})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed:', response.status);
        }
      })
      .then(data => {
        setsensex(data)
        
      })
      .catch(error => {
        console.error('Error:', error);
      });

      await fetch(yfinanceURL+"/longhistory/^CNXIT/max/1d",{method:"GET"})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed:', response.status);
        }
      })
      .then(data => {
        setNiftyIT(data)
        console.log(data)
      })
      .catch(error => {
        console.error('Error:', error);
      });

      await fetch(yfinanceURL+"/longhistory/NIFTY_FIN_SERVICE.NS/max/1d",{method:"GET"})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed:', response.status);
        }
      })
      .then(data => {
        setniftyFinService(data)
        console.log(data)
      })
      .catch(error => {
        console.error('Error:', error);
      });

    
      
  }

  

  const getIndicesData = async()=>{
     await fetch(`${yfinanceURL}/info/^NSEI`,{method:"GET"})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed:', response.status);
        }
      })
      .then(data => {
        console.log(data)
        setdata1({...data1,
            high: data.dayHigh,
            low:data.dayLow,
            open:data.open,
            prevClose:data.previousClose,
            symbol:data.symbol
          })
      })
      .catch(error => {
        console.error('Error:', error);
      });
   
    

   
     await fetch(yfinanceURL+"/info/^NSEBANK",{method:"GET"})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed:', response.status);
        }
      })
      .then(data => {
        setdata2({...data2,
          high: data.dayHigh,
          low:data.dayLow,
          open:data.open,
          prevClose:data.previousClose,
          symbol:data.symbol
        })
        
      })
      .catch(error => {
        console.error('Error:', error);
      });
   

   
     await fetch(yfinanceURL+"/info/^BSESN",{method:"GET"})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed:', response.status);
        }
      })
      .then(data => {
        setdata3({...data3,
            high: data.dayHigh,
            low:data.dayLow,
            open:data.open,
            prevClose:data.previousClose,
            symbol:data.symbol
          })
      })
      .catch(error => {
        console.error('Error:', error);
      });

      

      
  }


  const getMoreIndicesData = async()=>{
    await fetch(yfinanceURL+"/nifty50",{method:"GET"})
     .then(response => {
       if (response.ok) {
         return response.json();
       } else {
         throw new Error('Request failed:', response.status);
       }
     })
     .then(data => {
       if(data!==null){
        const mydata = data
        let i=1
        mydata.forEach(obj=>{
          obj.id = i++
          obj.change = (((obj.currentPrice-obj.previousClose)/obj.previousClose)*100).toFixed(2)
        })
        setnifty50Data(mydata)
       }
       
     })
     .catch(error => {
       console.error('Error:', error);
     });
   
 }

 const bankSector = async()=>{
  await fetch(yfinanceURL+"/bankSector",{method:"GET"})
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Request failed:', response.status);
    }
  })
  .then(data => {
    if(data!==null){
      const mydata = data
      let i=1
      mydata.forEach(obj=>{
        obj.id = i++
        obj.change = (((obj.currentPrice-obj.previousClose)/obj.previousClose)*100).toFixed(2)
      })
      console.log(mydata)
     setbankData(mydata)
    }
    
  })
  .catch(error => {
    console.error('Error:', error);
  });
 }

 async function Authenticate(){
  try {
      const token = localStorage.getItem("sessionToken")
      const response = await fetch("http://localhost:5002/auth",{
          method:"POST",
          headers: { Authorization: `Bearer ${token}`,
              sessionToken: token
          },
      })

      const res = await response.json();
      if(res==="Verified"){
          setload(true)
      }
  } catch (error) {
      console.error(error.message)
  }
}

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
        return 
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

const businessNews = async()=>{
  await fetch("https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=3f9fd800f2e8434fa4445f8077b737e4",{method:"GET"})
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Request failed:', response.status);
    }
  })
  .then(data => {
    
    if(data!==null){
      console.log(data.articles)
      setbusinessNews(abc=>{
        const kbc = data.articles.map(zzz=>{

          if(zzz.urlToImage === null){
            return <BusinessNewsBox
            key={zzz.url}
            url = {"https://static.vecteezy.com/system/resources/thumbnails/008/101/784/small/design-galery-image-thumbnail-symbol-icon-multimedia-icon-picture-icon-vector.jpg"}
            title= {zzz.title}
            date ={zzz.publishedAt}
            des={zzz.description}
            author={"Not Provided"}
            source={zzz.source.name}
            link={zzz.url}
        />

          }

          if(zzz.author === null){
            return <BusinessNewsBox
            key={zzz.url}
            url = {zzz.urlToImage}
            title= {zzz.title}
            date ={zzz.publishedAt}
            des={zzz.description}
            author={"Not Provided"}
            source={zzz.source.name}
            link={zzz.url}
        />

          }
          
            return <BusinessNewsBox
            key={zzz.url}
            url = {zzz.urlToImage}
            title= {zzz.title}
            date ={zzz.publishedAt}
            des={zzz.description}
            author={zzz.author}
            source={zzz.source.name}
            link={zzz.url}
        />
          
         
        })
        return kbc
         
       })
    }
    
  })
  .catch(error => {
    console.error('Error:', error);
  });
 }

const topGainers = NSEData.slice(0,10).map(kbc=>{
    return <CustomTable
        key={kbc.symbol}
        name={kbc.name}
        price = {kbc.price}
        close={kbc.close}
        symbol = {kbc.symbol}
        isDark={!isDark}
        profit = {kbc.profit}

    />
  })

  const topLosers = NSEData.slice(10).map(kbc=>{
    return <CustomTable
        key={kbc.symbol}
        name={kbc.name}
        price = {kbc.price}
        close={kbc.close}
        symbol = {kbc.symbol}
        isDark={!isDark}
        profit = {kbc.profit}

    />
  })



const allNSEData = async()=>{
  await fetch(yfinanceURL+"/getAllInfoNSE",{method:"GET"})
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Request failed:', response.status);
    }
  })
  .then(data => {
    const mappedData = Object.keys(data).map(stockSymbol => {
      const stockData = data[stockSymbol];
      return {
        symbol: stockSymbol,
        name: stockData.Name,
        price: stockData.Price,
        open: stockData.Open,
        high: stockData.High,
        low: stockData.Low,
        close: stockData.Close,
        volume: stockData.Volume,
        beta: stockData.Beta,
        exchange: stockData.Exchange,
        sector: stockData.Sector
      };
    });
    mappedData.forEach(stock => {
      stock.profit = stock.price - stock.close;
    });
    const losers = mappedData.filter(stock => stock.profit < 0);
    const gainers = mappedData.filter(stock => stock.profit >= 0);
    losers.sort((a, b) => a.profit - b.profit);
    gainers.sort((a, b) => b.profit - a.profit);
    const top10Losers = losers.slice(0, 10);
    const top10Gainers = gainers.slice(0, 10);
    const mergedData = top10Gainers.concat(top10Losers);
    
    console.log("Top 10 Highest Profit Stocks:");
    console.log(gainers);
    setNSEData(mergedData)
    
  })
  .catch(error => {
    console.error('Error:', error);
  });
 }

 const allBSEData = async()=>{
  await fetch(yfinanceURL+"/getAllInfoBSE",{method:"GET"})
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Request failed:', response.status);
    }
  })
  .then(data => {
    const mappedData = Object.keys(data).map(stockSymbol => {
      const stockData = data[stockSymbol];
      return {
        symbol: stockSymbol,
        name: stockData.Name,
        price: stockData.Price,
        open: stockData.Open,
        high: stockData.High,
        low: stockData.Low,
        close: stockData.Close,
        volume: stockData.Volume,
        beta: stockData.Beta,
        exchange: stockData.Exchange,
        sector: stockData.Sector
      };
    });
    mappedData.forEach(stock => {
      stock.profit = stock.close - stock.price;
    });
    const losers = mappedData.filter(stock => stock.profit < 0);
    const gainers = mappedData.filter(stock => stock.profit >= 0);
    losers.sort((a, b) => a.profit - b.profit);
    gainers.sort((a, b) => b.profit - a.profit);
    const top10Losers = losers.slice(0, 10);
    const top10Gainers = gainers.slice(0, 10);
    const mergedData = top10Gainers.concat(top10Losers);
    
    console.log("Top 10 Highest Profit Stocks:");
    console.log(gainers);
    setBSEData(mergedData)
    
  })
  .catch(error => {
    console.error('Error:', error);
  });
 }


 //console.log(nifty50Data)
//  const getX = nifty50.find(obj=>obj.TATAMOTORS)?.TATAMOTORS
//  console.log(getX.beta)

const logout = () =>{
  localStorage.removeItem("sessionToken");
  return location.reload()
}
  

  useEffect(()=>{

    if (typeof window !== 'undefined') {
      if(localStorage.getItem("sessionToken")!=="" ){
        Authenticate()
        getUserData()
      }else{
        return
      }
    }
      
      getIndices()
      getIndicesData()
      getMoreIndicesData()
      bankSector()
      businessNews()
      allNSEData()
      allBSEData()
      const mergedArray = NSEData.concat(BSEData);
      setAllIndex([...AllIndex,...mergedArray])

      if (containers.current) {
        containers.current.scrollTo(0, Math.random() * 5000);
      }

      
      
      
      // const observer = new IntersectionObserver(
      //   (entries) => {
      //     entries.forEach((entry) => {
      //       if (entry.isIntersecting) {
      //         // Load Highcharts when the element is visible
              
      //         //observer.unobserve(entry.target);
      //       }
      //     });
      //   },
      //   { threshold: 0.1 } // Adjust the threshold as needed
      // );

      // document.body.className = testtheme;
        
      
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
  },[isDark])

  const collapseItems = [
    "Features",
    "Customers",
    "Pricing",
    "Company",
    "Legal",
    "Team",
    "Help & Feedback",
    "Login",
    "Sign Up",
  ];

  
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
      <div>
        
        
      <Navbar shouldHideOnScroll={false} variant={"sticky"} css={{width:"100%", backgroundColor:"$background"}}>
      <Navbar.Toggle showIn="xs" aria-label="toggle navigation" />
        <Navbar.Brand>
        <box-icon name='trending-up' color='#1aae30' ></box-icon>
        <Text b>GrowthIN</Text>
          
        </Navbar.Brand>
        <Navbar.Content hideIn="xs">
        <Dropdown flat light color="default">
          <Dropdown.Button light color="default">Features</Dropdown.Button>
          <Dropdown.Menu aria-label="Static Actions">
            <Dropdown.Item key="new"><Button auto light color="default" onClick={abc=>{screener()}}>Screener</Button></Dropdown.Item>
            <Dropdown.Item key="copy"><Button auto light color="default" onClick={abc=>{supercharts()}}>SuperCharts</Button></Dropdown.Item>
            <Dropdown.Item key="compare"><Button auto light color="default" onClick={abc=>{supercharts()}}>Compare</Button></Dropdown.Item>
            <Dropdown.Item key="predict"><Button auto light color="default" onClick={abc=>{prediction()}}>Predictions</Button></Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
          <Navbar.Link href="#">Customers</Navbar.Link>
          <Navbar.Link href="#">Pricing</Navbar.Link>
          <Navbar.Link href="#">Company</Navbar.Link>
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
              
                <Button onClick={abc=>logout()} size="xs" color="error" light css={{ fontSize:"$md",marginRight:"$1"}}>Logout</Button>
                
              
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
          shadow
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
        {collapseItems.map((item, index) => (
          <Navbar.CollapseItem key={item}>
            <Link
              color="inherit"
              css={{
                width:"100%",
        
              
              }}
              href="#"
            >
              {item}
            </Link>
          </Navbar.CollapseItem>
        ))}
      </Navbar.Collapse>
      </Navbar>
        </div>

       
    <div className='startpage'>
      <div className='midstartpage'>

        <div className='topSearchSec'>
      
          <div className='startpgpic'>
            <div className='mainimg'>
              <LazyLoadImage
                alt='homeimg'
                src='https://images.pexels.com/photos/355770/pexels-photo-355770.jpeg?cs=srgb&dl=pexels-pixabay-355770.jpg&fm=jpg'
                effect='blur'
              />
            </div>
            <div className='shadowEffect' style={{
              background: isDark ? "linear-gradient(180deg,hsla(0,0%,0%,0)58%, hsl(0,0%,0%) 100%)" : "linear-gradient(180deg,hsla(0,0%,0%,0)58%, hsl(0,0%,100%) 100%)"
            }}></div>
                  {/* <img src="https://images.pexels.com/photos/355770/pexels-photo-355770.jpeg?cs=srgb&dl=pexels-pixabay-355770.jpg&fm=jpg"></img> */}
                </div>

                <div className="scrolling-line-container">
          <div className="scrolling-line">
            {/* {scrollingText} */}
            {(NSEData).map(abc=>{
              return(
                <div className='scrolling-align' key={abc.name}>
                    <p key={abc.name}><b>{abc.name}</b> <Image src={abc.profit >=0 ? Up : Down} width={15}></Image> <b style={{color:abc.profit>=0 ? "green" : "red"}}>{((abc.profit/abc.close)*100).toFixed(2)}%</b> </p>
                </div>
                
              )
            })}
          </div>
        </div>

        <div className="scrolling-line-container2">
          <div className="scrolling-line2">
            {/* {scrollingText} */}
            {(BSEData).map(abc=>{
              return(
                <div className='scrolling-align2' key={abc.name}>
                    <p key={abc.name}><b>{abc.name}</b> <Image src={abc.profit >=0 ? Up : Down} width={15}></Image> <b style={{color:abc.profit>=0 ? "green" : "red"}}>{((abc.profit/abc.close)*100).toFixed(2)}%</b> </p>
                </div>
                
              )
            })}
          </div>
        </div>

               

            <div className='search'>
            <div className='maintitle'>
                  <h1><b>Stay Ahead with Real-Time Insights and Expert Analysis on India&apos;s Financial Landscape.</b></h1>
                  </div>
              
                <div className='subSearch' >
                        
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    
                    options={stock}
                    getOptionLabel={option => option.label}
                    sx={{ width: 300}}

                    onInputChange={handleChange}
                    renderInput={(params) => 
                    <TextField 
                      
                      {...params} 
                      variant="outlined"
        
                      label="Are you looking for stocks?"
                      
                      />}
                      renderOption={(props, option) => (
                        <li {...props} className="MuiAutocomplete-option" >
                          <p style={{ color: '#16181A' }}>{option.label}</p>
                        </li>
                      )}
                  />
                    <IconButton aria-label="search" size="large">
                      <Search onClick={travel} fontSize="inherit"/>
                    </IconButton>

                </div>
            </div>
               
            </div>
     
     
   <div>
   
     <div className="boxindices" {...events} ref={containers}>

<div className="innerboxindices" style={{boxShadow:isDark? "0px 4px 6px rgba(255,255,255,0.5)":"0px 4px 6px rgba(0,0,0,0.5)",backgroundColor:isDark? "black": "white"}}>
        <div className='subinnerboxindices'>
        <h4>Nifty 50</h4>
        <Avatar squared size="sm" onClick={abc=>travelSpecific('^NSEI')} icon={<box-icon name='link' color={isDark?"#FFFFFF" : "#16181A"}></box-icon>}></Avatar>
        </div>
        <div className='innerboxchart'>
        {nifty.length>0 ?          <GeneralChart
                          data={nifty}
                          name="Nifty 50"
                          isDark = {isDark}
                          height="240px"
                          uniqueID="1"
                        /> : <div style={{paddingLeft:"160px",paddingTop:"100px"}}><Loading color="success" size="md"/></div>}
          </div>
        
</div>

<div className="innerboxindices" style={{boxShadow:isDark? "0px 4px 6px rgba(255,255,255,0.5)":"0px 4px 6px rgba(0,0,0,0.5)",backgroundColor:isDark? "black": "white"}}>
<div className='subinnerboxindices'>
        <h4>Banknifty</h4>
        <Avatar squared size="sm" onClick={abc=>travelSpecific('^NSEBANK')} icon={<box-icon name='link' color={isDark?"#FFFFFF" : "#16181A"}></box-icon>}></Avatar>
        </div>
        <div className='innerboxchart'>
        {bank.length>0 ?          <GeneralChart
                          data={bank}
                          name="Bank Nifty"
                          isDark = {isDark}
                          height="240px"
                          uniqueID="2"
                        /> : <div style={{paddingLeft:"160px",paddingTop:"100px"}}><Loading color="success" size="md"/></div>}
          </div>
</div>

<div className="innerboxindices" style={{boxShadow:isDark? "0px 4px 6px rgba(255,255,255,0.5)":"0px 4px 6px rgba(0,0,0,0.5)",backgroundColor:isDark? "black": "white"}}>
<div className='subinnerboxindices'>
        <h4>Sensex</h4>
        <Avatar squared size="sm" onClick={abc=>travelSpecific('^NSEI')} icon={<box-icon name='link' color={isDark?"#FFFFFF" : "#16181A"}></box-icon>}></Avatar>
        </div>
        <div className='innerboxchart'>
        {sensex.length>0 ?          <GeneralChart
                          data={sensex}
                          name="Sensex"
                          isDark = {isDark}
                          height="240px"
                          uniqueID="3"
                        /> : <div style={{paddingLeft:"160px",paddingTop:"100px"}}><Loading color="success" size="md"/></div>}
          </div>
</div>



<div className="innerboxindices" style={{boxShadow:isDark? "0px 4px 6px rgba(255,255,255,0.5)":"0px 4px 6px rgba(0,0,0,0.5)",backgroundColor:isDark? "black": "white"}}>
<div className='subinnerboxindices'>
        <h4>Nifty IT</h4>
        <Avatar squared size="sm" onClick={abc=>travelSpecific('^NSEI')} icon={<box-icon name='link' color={isDark?"#FFFFFF" : "#16181A"}></box-icon>}></Avatar>
        </div>
        <div className='innerboxchart'>
        {niftyIT.length>0 ?          <GeneralChart
                          data={niftyIT}
                          name="Bank Nifty"
                          isDark = {isDark}
                          height="240px"
                          uniqueID="5"
                        /> : <div style={{paddingLeft:"160px",paddingTop:"100px"}}><Loading color="success" size="md"/></div>}
          </div>
</div>

<div className="innerboxindices" style={{boxShadow:isDark? "0px 4px 6px rgba(255,255,255,0.3)":"0px 4px 6px rgba(0,0,0,0.3)",backgroundColor:isDark? "black": "white"}}>
<div className='subinnerboxindices'>
        <h4>Nifty Fin Serv</h4>
        <Avatar squared size="sm" onClick={abc=>travelSpecific('^NSEI')} icon={<box-icon name='link' color={isDark?"#FFFFFF" : "#16181A"}></box-icon>}></Avatar>
        </div>
        <div className='innerboxchart'>
        {niftyFinService.length>0 ?          <GeneralChart
                          data={niftyFinService}
                          name="Bank Nifty"
                          isDark = {isDark}
                          height="240px"
                          uniqueID="6"
                        /> :  <div style={{paddingLeft:"160px",paddingTop:"100px"}}><Loading color="success" size="md"/></div>}
          </div>
</div>


</div>


   </div>
   <div className='top'>
      <div className='gainers' style={{display:'grid',gridTemplateColumns:'auto auto',margin:'100px'}}>
        <div>
        <h2 style={{textAlign:'center'}}>Top Gainers</h2>
                        {NSEData.length !==0? topGainers: <Loading size='lg' style={{display:'flex',width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}} color="success"></Loading>}
        </div>
        <div>
        <h2 style={{textAlign:'center'}}>Top Losers</h2>
        {NSEData.length !==0? topLosers: <Loading size='lg' style={{display:'flex',width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}} color="success"></Loading>}
        </div>
        
          

    </div>
    <div className='gainers'>

      </div>
   </div>
   

   <div>
    <h2 style={{display:'flex',justifyContent:'center'}}>Features</h2>

      <div className='screnner' style={{margin:'100px'}}>
          <div className='screenerimg' >
            <Image src={isDark? ScreenerDark : ScreenerLight} width={800} alt='Screener'></Image>
            </div>
        <div className='screenerDes'>
                    <div>
                      <h4><u>Introducing Our Powerful Stock Screener.</u></h4>
                      <p>A robust tool designed to empower you with the ability to navigate the vast world of stocks and investments with ease. Whether you&apos;re a seasoned trader or a novice investor, our Screener is your key to informed decision-making.</p>
                    </div>
                    <div className='scrennerBoxes'>
                      <div className='Screenrebox'>
                        <box-icon name='git-compare' color={isDark ? "#FFFFFF" : "#16181A"} ></box-icon>
                        <p>Fine tuned Comparision</p>
                        <small>Want to analyze price-to-earnings ratios, dividend yields, or market capitalization? It&apos;s all at your fingertips.</small>
                        </div>
                        <div className='Screenrebox'>
                        <box-icon name='brain' color={isDark ? "#FFFFFF" : "#16181A"} ></box-icon>
                        <p>Streamlined Decision-Making</p>
                        <small>Identify top performers, hidden gems, or stocks that fit specific financial strategies effortlessly.</small>
                        </div>
                        <div className='Screenerbox'>
                        <box-icon name='data' color={isDark ? "#FFFFFF" : "#16181A"} ></box-icon>
                        <p>Bigger and Better</p>
                        <small>With access to a database of over 3000 stocks spanning across multiple exchanges and categorized into 13 distinct sectors.</small>
                        </div>
                        <div className='Screenrebox'>
                        <box-icon name='recycle' color={isDark ? "#FFFFFF" : "#16181A"} ></box-icon>
                        <p>Stay Informed</p>
                        <small>Receive instant insights into how stocks are performing and make timely decisions.</small>
                        </div>
                    </div>
          </div>
      </div>

      <div className='charts' style={{margin:'100px'}}>
        <div>
        <div>
                      <h4><u>Discover the Power of Superchart.</u></h4>
                      <p>Introducing Superchart, your gateway to the world of dynamic, real-time financial data visualization. Whether you&apos;re an experienced trader, a data enthusiast, or simply someone looking to make informed decisions, Superchart is here to transform the way you explore and understand financial markets.</p>
                    </div>
             <div className='chartBoxes'>
                    
                      <div className='chartbox'>
                        <box-icon name='cloud-lightning' color={isDark ? "#FFFFFF" : "#16181A"} ></box-icon>
                        <p>Real-Time Data, Real-Time Decisions</p>
                        <small>Superchart is your window into the heartbeat of the financial world. With real-time data streaming, you can stay ahead of the curve and react swiftly to market changes.</small>
                        </div>
                        
                        <div className='chartbox'>
                        <box-icon name='cog' color={isDark ? "#FFFFFF" : "#16181A"} ></box-icon>
                        <p>Indicators for Every Strategy</p>
                        <small>From moving averages to RSI, Bollinger Bands to MACD, our Superchart empowers you with the tools to gauge market sentiment and make well-informed trading decisions.</small>
                        </div>
                        <div className='chartbox'>
                        <box-icon name='line-chart' color={isDark ? "#FFFFFF" : "#16181A"} ></box-icon>
                        <p>Chart Your Course</p>
                        <small>Whether you lean towards candlestick charts for precision, line charts for simplicity, or OHLC charts for comprehensive insights, Superchart has it all. </small>
                        </div>
                        <div className='chartbox'>
                        <box-icon name='time-five' color={isDark ? "#FFFFFF" : "#16181A"} ></box-icon>
                        <p>Timeframes That Suit You</p>
                        <small>Time is of the essence in trading. Superchart offers multiple timeframes, from the granular 1-minute view to the broader daily perspective and everything in between. </small>
                        </div>
                    </div>
        </div>
                    
                        <div className='chartimg'>
                        <Image src={isDark? ChartDark : ChartLight} width={700} alt='Chart'></Image>
                        </div>

                        
      </div>
    
   </div>

{/* <div className='testcontainer' {...events} ref={containers}>
      <div className='testsubcontainers'>
        <img src='https://wallpapershome.com/images/wallpapers/windows-11-2560x1440-dark-abstract-microsoft-4k-23470.jpg' width="500px"></img>
      </div>
      <div className='testsubcontainers'>
        <img src='https://wallpapershome.com/images/wallpapers/windows-11-2560x1440-dark-abstract-microsoft-4k-23470.jpg' width="500px"></img>
      </div>
      <div className='testsubcontainers'>
        <img src='https://wallpapershome.com/images/wallpapers/windows-11-2560x1440-dark-abstract-microsoft-4k-23470.jpg' width="500px"></img>
      </div>
      <div className='testsubcontainers'>
        <img src='https://wallpapershome.com/images/wallpapers/windows-11-2560x1440-dark-abstract-microsoft-4k-23470.jpg' width="500px"></img>
      </div>
      <div className='testsubcontainers'>
        <img src='https://wallpapershome.com/images/wallpapers/windows-11-2560x1440-dark-abstract-microsoft-4k-23470.jpg' width="500px"></img>
      </div>
      <div className='testsubcontainers'>
        <img src='https://wallpapershome.com/images/wallpapers/windows-11-2560x1440-dark-abstract-microsoft-4k-23470.jpg' width="500px"></img>
      </div>
</div> */}
     
        


<div className='news'>
    <h1><b>Today&apos;s Headlines</b></h1>
              <hr></hr>
      <div className='buisnessNews'>
        
              {bNews}
      </div>
</div>
      

      <div className='timedetails'>
            <small>Last Updated : {Date()}</small>
            <br></br>
            <small>Data by <b>Yahoo Finance</b></small>
        </div>

      </div>
      <div className='extra'>
        <br></br>
      </div>
      
    
      
      
    </div>
    </NextUIProvider>
    </NextThemesProvider>
   
  )
}
