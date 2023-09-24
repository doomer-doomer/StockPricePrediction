"use client"
import dynamic from 'next/dynamic'
import { ToastContainer } from 'react-toastify';

const SSRfreeHome = dynamic(()=>import('../../components/homeComp'),{ssr:false});

// import { useRouter } from 'next/navigation';
// import React, { useEffect, useRef, useState } from 'react';
// import Head from './head';
// import Link from 'next/link';
// import dynamic from 'next/dynamic';
// import './startpg.css'
// import Image from 'next/image';
// import Highcharts from 'highcharts/highstock';
// //import HighchartsReact from 'highcharts-react-official';
// import sand from 'highcharts/themes/sand-signika';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import IconButton from '@mui/material/IconButton';
// import Search from '@mui/icons-material/Search'

// import {Dropdown} from "@nextui-org/react"
// import { styled } from '@mui/material/styles';
// import { Avatar } from '@nextui-org/react';

// import { Navbar, Button, Text, Card, Radio, theme,Container, Row } from "@nextui-org/react";
// import Up from '../app/arrow-up.png'
// import Down from '../app/down.png'

// import CollapsibleTable from './table';
// import stock from './stock';

// import { NextUIProvider } from '@nextui-org/react';
// import { Grid, Switch } from "@nextui-org/react";
// import { SunIcon } from './sun';
// import { MoonIcon } from './moon';

// import { createTheme } from "@nextui-org/react"
// import { ThemeProvider as NextThemesProvider } from 'next-themes';
// import { LazyLoadImage } from 'react-lazy-load-image-component';
// import 'react-lazy-load-image-component/src/effects/blur.css';

// // import VisibilitySensor from 'react-visibility-sensor';
// // import { Skeleton } from '@mui/material';

// // import { UseSelector, useSelector } from 'react-redux/es/hooks/useSelector';
// import BusinessNewsBox from './newsBox';
// import columns from './columns';
// import { DataGrid,GridToolbar } from '@mui/x-data-grid';
// import Box from '@mui/material/Box';

// const HighchartsReact = dynamic(() => import('highcharts-react-official'), {
//   ssr: false, // This disables SSR for this component
// });


// const lightTheme = createTheme({
//   type: 'light',
  
// })

// const darkTheme = createTheme({
//   type: 'dark',
//   colors:{
//     modes: {
//       dark: {
//         background: '#16181A', // Set your desired background color here
//         // ... other dark theme configuration
//       },
//     },
//   }
  
// })

// sand(Highcharts);

export default function Home() {

//   const yfinanceURL = "https://yfinance-server.onrender.com"

//   const [script,setscript]=useState("");
//   const [open, setOpen] = useState(false);
//   const [nifty50Data,setnifty50Data] = useState([])
//   const [bankData,setbankData] = useState([])
//   const [healthData,sethealthData] = useState([])
//   const [autoData,setautoData] = useState([])
//   const [consumer50Data,setconsumer50Data] = useState([])
//   const [financeNiftyData,setfinanceData] = useState([])
//   const [energyData,setenergyData] = useState([])
//   const [FMGCData,setFMGCData] = useState([])
//   const [ITData,setITData] = useState([])
//   const [MediaData,setMediaData] = useState([])
//   const [Oil50Data,setOil50Data] = useState([])
//   const [pharmaNiftyData,setpharmaData] = useState([])
//   const [privateBankData,setprivateBankData] = useState([])
//   const [realtyData,setrealtyData] = useState([])

//   const [NSEData,setNSEData] = useState([])
//   const [BSEData,setBSEData] = useState([])
//   const [AllIndex,setAllIndex]=useState(NSEData.concat(BSEData))

//   const [bNews,setbusinessNews]=useState([])

//   const router = useRouter();

//   const [data1,setdata1]= useState({
//     high:"",
//     low:"",
//     open:"",
//     prevClose:"",
//     symbol:""
//   })

//   const [data2,setdata2]= useState({
//     high:"",
//     low:"",
//     open:"",
//     prevClose:"",
//     symbol:""
//   })

//   const [data3,setdata3]= useState({
//     high:"",
//     low:"",
//     open:"",
//     prevClose:"",
//     symbol:""
//   })
//   const[indices,setindices]=useState([])
//   const [nifty,setnifty]=useState([])
//   const [bank ,setbank] = useState([])
//   const [sensex,setsensex] = useState([])

//   const [userData,setUserData]=useState({
//     user_name:"",
//     email:""
//   })

//   const [chartVisible, setChartVisible] = useState(false);
//   const [chartVisible2, setChartVisible2] = useState(false);
//   const [chartVisible3, setChartVisible3] = useState(false);

//   const handleVisibilityChange = (isVisible) => {
//     if (isVisible && !chartVisible && nifty.length>0 ) {
//       setChartVisible(true);
//     }
//   };

//   const handleVisibilityChange2 = (isVisible) => {
//     if (isVisible && !chartVisible2 && bank.length>0) {
//       setChartVisible2(true);
//     }
//   };

//   const handleVisibilityChange3 = (isVisible) => {
//     if (isVisible && !chartVisible3 && sensex.length>0) {
//       setChartVisible3(true);
//     }
//   };




//   const [isDark, setIsDark] = useState(false);
//   const [testtheme, testsetTheme] = useState('light');

//   const [load,setload] = useState(false)
//   const [selected, setSelected] = React.useState(new Set(["Select a Stock"]));

//   const handleChange = (e,value)=>{
//     //e.preventDefault();
//     setscript(value)
//     console.log(value)
//     //router.push(`/stocks/${value}`)
//   }

//   const travel = (e)=>{
//     e.preventDefault()
//     if(script===""){
//       return alert("Select a Stock")
//     }
//     router.push(`/stocks/${script}`)
//   }

//   const screener = (e)=>{
//     router.push(`/stocks/screener`)
//   }

//   const supercharts = (e)=>{
//     router.push(`/stocks/chart/^NSEI`)
//   }

//   const areachart1 = {
//     rangeSelector: {
//       selected: 5,
//       buttonTheme: {
//         fill: isDark ? "#FFFFFF" : "#16181A",
//             stroke: 'none',
//             'stroke-width': 0,
//             r: 8,
//             style: {
//                 color: isDark ? "#16181A" : "#ECEDEE",
//                 fontWeight: 'bold'
//             },
//             states: {
//                 hover: {
//                   fill: isDark ? "#16181A" : "#ECEDEE",
//                     style: {
//                         color: isDark ? "#FFFFFF" : "#16181A"
//                     }
//                 },
//                 select: {
//                     fill: isDark ? "#16181A" : "#ECEDEE",
//                     style: {
//                         color: isDark ? "#FFFFFF" : "#16181A"
//                     }
//                 }
//                 // disabled: { ... }
//             }
//         },
//         labelStyle: {
//           color: isDark ? "#ECEDEE" : "#16181A",
//           fontWeight: 'bold'
//       },
//     },
//     chart:{
//       style:{
//         backgroundColor:isDark ? "black" : "white"
//       }
//     },
    
//     navigator:{
//       enabled:false
//     },
//     yAxis:[
//       {
//         gridLineWidth: 0,
//       }
//     ],
//     series: [
//       {
//         name: "NIFTY 50",
//         type:"spline",
//         data:nifty.map(obj=>
//           [new Date(obj.Date).getTime(),obj.Close]
//         ),
        
//         tooltip: {
//           valueDecimals: 2
//         },
//         fillColor: {
//           linearGradient: {
//               x1: 0,
//               y1: 0,
//               x2: 0,
//               y2: 1
//           },
//           stops: [
//               [0, "#6A0DAD"],
//               [1, "ABA9AD"]
//           ]
//       },
//       color:"#6A0DAD",
//       }, 
//     ],
//   };

//   const areachart2 = {
//     rangeSelector: {
//       selected: 5,
//       buttonTheme: {
//         fill: isDark ? "#FFFFFF" : "#16181A",
//             stroke: 'none',
//             'stroke-width': 0,
//             r: 8,
//             style: {
//                 color: isDark ? "#16181A" : "#ECEDEE",
//                 fontWeight: 'bold'
//             },
//             states: {
//                 hover: {
//                   fill: isDark ? "#16181A" : "#ECEDEE",
//                     style: {
//                         color: isDark ? "#FFFFFF" : "#16181A"
//                     }
//                 },
//                 select: {
//                     fill: isDark ? "#16181A" : "#ECEDEE",
//                     style: {
//                         color: isDark ? "#FFFFFF" : "#16181A"
//                     }
//                 }
//                 // disabled: { ... }
//             }
//         },
//         labelStyle: {
//           color: isDark ? "#ECEDEE" : "#16181A",
//           fontWeight: 'bold'
//       },
//     },
//     chart:{
//       style:{
//         backgroundColor:isDark ? "black" : "white"
//       }
//     },
//     navigator:{
//       enabled:false
//     },
//     yAxis:[
//       {
//         gridLineWidth: 0,
//       }
//     ],
//     series: [
//       {
//         name: "NIFTY BANK",
//         type:"spline",
//         data:bank.map(obj=>
//           [new Date(obj.Date).getTime(),obj.Close]
//         ),
        
//         tooltip: {
//           valueDecimals: 2
//         },
//         fillColor: {
//           linearGradient: {
//               x1: 0,
//               y1: 0,
//               x2: 0,
//               y2: 1
//           },
//           stops: [
//               [0, "#63ff25"],
//               [1, "ABA9AD"]
//           ]
//       },
//       color:"#63ff25",
//       }, 
//     ],
//   };

//   const areachart3 = {
//     rangeSelector: {
//       selected: 5,
//       buttonTheme: {
//         fill: isDark ? "#FFFFFF" : "#16181A",
//             stroke: 'none',
//             'stroke-width': 0,
//             r: 8,
//             style: {
//                 color: isDark ? "#16181A" : "#ECEDEE",
//                 fontWeight: 'bold'
//             },
//             states: {
//                 hover: {
//                   fill: isDark ? "#16181A" : "#ECEDEE",
//                     style: {
//                         color: isDark ? "#FFFFFF" : "#16181A"
//                     }
//                 },
//                 select: {
//                     fill: isDark ? "#16181A" : "#ECEDEE",
//                     style: {
//                         color: isDark ? "#FFFFFF" : "#16181A"
//                     }
//                 }
//                 // disabled: { ... }
//             }
//         },
//         labelStyle: {
//           color: isDark ? "#ECEDEE" : "#16181A",
//           fontWeight: 'bold'
//       },
//     },
//     chart:{
//       style:{
//         backgroundColor:isDark ? "black" : "white"
//       },
//       scrollbar: {
//         enabled: false
//       }
//     },
//     navigator:{
//       enabled:false,
     
//     },
//     yAxis:[
//       {
//         gridLineWidth: 0,
//       }
//     ],
//     series: [
//       {
//         name: "NIFTY 50",
//         type:"spline",
//         data:sensex.map(obj=>
//           [new Date(obj.Date).getTime(),obj.Close]
//         ),
        
//         tooltip: {
//           valueDecimals: 2
//         },
//         fillColor: {
//           linearGradient: {
//               x1: 0,
//               y1: 0,
//               x2: 0,
//               y2: 1
//           },
//           stops: [
//               [0, "#fffc35"],
//               [1, "ABA9AD"]
//           ]
//       },
//       color:"#fffc35",
//       }, 
//     ],
//   };


//   const getIndices = async()=>{

    
//       await fetch(yfinanceURL+"/longhistory/^NSEI/max/1d",{method:"GET"})
//       .then(response => {
//         if (response.ok) {
//           return response.json();
//         } else {
//           throw new Error('Request failed:', response.status);
//         }
//       })
//       .then(data => {
//         setnifty(data)
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });

//       await fetch(yfinanceURL+"/longhistory/^NSEBANK/max/1d",{method:"GET"})
//       .then(response => {
//         if (response.ok) {
//           return response.json();
//         } else {
//           throw new Error('Request failed:', response.status);
//         }
//       })
//       .then(data => {
//         setbank(data)
        
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
    
//       await fetch(yfinanceURL+"/longhistory/^BSESN/max/1d",{method:"GET"})
//       .then(response => {
//         if (response.ok) {
//           return response.json();
//         } else {
//           throw new Error('Request failed:', response.status);
//         }
//       })
//       .then(data => {
//         setsensex(data)
        
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
    
      
//   }

  

//   const getIndicesData = async()=>{

   
//      await fetch(yfinanceURL+"/info/^NSEI",{method:"GET"})
//       .then(response => {
//         if (response.ok) {
//           return response.json();
//         } else {
//           throw new Error('Request failed:', response.status);
//         }
//       })
//       .then(data => {
//         setdata1({...data1,
//             high: data.dayHigh,
//             low:data.dayLow,
//             open:data.open,
//             prevClose:data.previousClose,
//             symbol:data.symbol
//           })
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
   
    

   
//      await fetch(yfinanceURL+"/info/^NSEBANK",{method:"GET"})
//       .then(response => {
//         if (response.ok) {
//           return response.json();
//         } else {
//           throw new Error('Request failed:', response.status);
//         }
//       })
//       .then(data => {
//         setdata2({...data2,
//           high: data.dayHigh,
//           low:data.dayLow,
//           open:data.open,
//           prevClose:data.previousClose,
//           symbol:data.symbol
//         })
        
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
   

   
//      await fetch(yfinanceURL+"/info/^BSESN",{method:"GET"})
//       .then(response => {
//         if (response.ok) {
//           return response.json();
//         } else {
//           throw new Error('Request failed:', response.status);
//         }
//       })
//       .then(data => {
//         setdata3({...data3,
//             high: data.dayHigh,
//             low:data.dayLow,
//             open:data.open,
//             prevClose:data.previousClose,
//             symbol:data.symbol
//           })
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });

      

      
//   }


//   const getMoreIndicesData = async()=>{
//     await fetch(yfinanceURL+"/nifty50",{method:"GET"})
//      .then(response => {
//        if (response.ok) {
//          return response.json();
//        } else {
//          throw new Error('Request failed:', response.status);
//        }
//      })
//      .then(data => {
//        if(data!==null){
//         const mydata = data
//         let i=1
//         mydata.forEach(obj=>{
//           obj.id = i++
//           obj.change = (((obj.currentPrice-obj.previousClose)/obj.previousClose)*100).toFixed(2)
//         })
//         setnifty50Data(mydata)
//        }
       
//      })
//      .catch(error => {
//        console.error('Error:', error);
//      });
   
//  }

//  const bankSector = async()=>{
//   await fetch(yfinanceURL+"/bankSector",{method:"GET"})
//   .then(response => {
//     if (response.ok) {
//       return response.json();
//     } else {
//       throw new Error('Request failed:', response.status);
//     }
//   })
//   .then(data => {
//     if(data!==null){
//       const mydata = data
//       let i=1
//       mydata.forEach(obj=>{
//         obj.id = i++
//         obj.change = (((obj.currentPrice-obj.previousClose)/obj.previousClose)*100).toFixed(2)
//       })
//      setbankData(mydata)
//     }
    
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
//  }

//  async function Authenticate(){
//   try {
//       const token = localStorage.getItem("sessionToken")
//       const response = await fetch("http://localhost:5002/auth",{
//           method:"POST",
//           headers: { Authorization: `Bearer ${token}`,
//               sessionToken: token
//           },
//       })

//       const res = await response.json();
//       if(res==="Verified"){
//           setload(true)
//       }
//   } catch (error) {
//       console.error(error.message)
//   }
// }

// async function getUserData(){
//   try {
//       const token = localStorage.getItem("sessionToken")
//       const response = await fetch("http://localhost:5002/getData",{
//           method:"POST",
//           headers: { Authorization: `Bearer ${token}`,
//               sessionToken: token
//           },
//       })

//       const res = await response.json();
//       if(!response.ok){
//         return alert("Not workin")
//       }
//       console.log(res.user_name)
//       setUserData({...userData,
//         user_name:res.map(abc=>abc.user_name.slice(0,1)),
//         email:res.map(abc=>abc.email)
//       })
//       setload(true)
//   } catch (error) {
//       console.error(error.message)
//   }
// }

// const businessNews = async()=>{
//   await fetch("https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=3f9fd800f2e8434fa4445f8077b737e4",{method:"GET"})
//   .then(response => {
//     if (response.ok) {
//       return response.json();
//     } else {
//       throw new Error('Request failed:', response.status);
//     }
//   })
//   .then(data => {
    
//     if(data!==null){
//       console.log(data.articles)
//       setbusinessNews(abc=>{
//         const kbc = data.articles.map(zzz=>{

//           if(zzz.urlToImage === null){
//             return <BusinessNewsBox
//             key={zzz.url}
//             url = {"https://static.vecteezy.com/system/resources/thumbnails/008/101/784/small/design-galery-image-thumbnail-symbol-icon-multimedia-icon-picture-icon-vector.jpg"}
//             title= {zzz.title}
//             date ={zzz.publishedAt}
//             des={zzz.description}
//             author={"Not Provided"}
//             source={zzz.source.name}
//             link={zzz.url}
//         />

//           }

//           if(zzz.author === null){
//             return <BusinessNewsBox
//             key={zzz.url}
//             url = {zzz.urlToImage}
//             title= {zzz.title}
//             date ={zzz.publishedAt}
//             des={zzz.description}
//             author={"Not Provided"}
//             source={zzz.source.name}
//             link={zzz.url}
//         />

//           }
          
//             return <BusinessNewsBox
//             key={zzz.url}
//             url = {zzz.urlToImage}
//             title= {zzz.title}
//             date ={zzz.publishedAt}
//             des={zzz.description}
//             author={zzz.author}
//             source={zzz.source.name}
//             link={zzz.url}
//         />
          
         
//         })
//         return kbc
         
//        })
//     }
    
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
//  }



// const allNSEData = async()=>{
//   await fetch(yfinanceURL+"/getAllInfoNSE",{method:"GET"})
//   .then(response => {
//     if (response.ok) {
//       return response.json();
//     } else {
//       throw new Error('Request failed:', response.status);
//     }
//   })
//   .then(data => {
//     const mappedData = Object.keys(data).map(stockSymbol => {
//       const stockData = data[stockSymbol];
//       return {
//         symbol: stockSymbol,
//         name: stockData.Name,
//         price: stockData.Price,
//         open: stockData.Open,
//         high: stockData.High,
//         low: stockData.Low,
//         close: stockData.Close,
//         volume: stockData.Volume,
//         beta: stockData.Beta,
//         exchange: stockData.Exchange,
//         sector: stockData.Sector
//       };
//     });
//     mappedData.forEach(stock => {
//       stock.profit = stock.close - stock.price;
//     });
//     const losers = mappedData.filter(stock => stock.profit < 0);
//     const gainers = mappedData.filter(stock => stock.profit >= 0);
//     losers.sort((a, b) => a.profit - b.profit);
//     gainers.sort((a, b) => b.profit - a.profit);
//     const top10Losers = losers.slice(0, 10);
//     const top10Gainers = gainers.slice(0, 10);
//     const mergedData = top10Gainers.concat(top10Losers);
    
//     console.log("Top 10 Highest Profit Stocks:");
//     console.log(gainers);
//     setNSEData(mergedData)
    
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
//  }

//  const allBSEData = async()=>{
//   await fetch(yfinanceURL+"/getAllInfoBSE",{method:"GET"})
//   .then(response => {
//     if (response.ok) {
//       return response.json();
//     } else {
//       throw new Error('Request failed:', response.status);
//     }
//   })
//   .then(data => {
//     const mappedData = Object.keys(data).map(stockSymbol => {
//       const stockData = data[stockSymbol];
//       return {
//         symbol: stockSymbol,
//         name: stockData.Name,
//         price: stockData.Price,
//         open: stockData.Open,
//         high: stockData.High,
//         low: stockData.Low,
//         close: stockData.Close,
//         volume: stockData.Volume,
//         beta: stockData.Beta,
//         exchange: stockData.Exchange,
//         sector: stockData.Sector
//       };
//     });
//     mappedData.forEach(stock => {
//       stock.profit = stock.close - stock.price;
//     });
//     const losers = mappedData.filter(stock => stock.profit < 0);
//     const gainers = mappedData.filter(stock => stock.profit >= 0);
//     losers.sort((a, b) => a.profit - b.profit);
//     gainers.sort((a, b) => b.profit - a.profit);
//     const top10Losers = losers.slice(0, 10);
//     const top10Gainers = gainers.slice(0, 10);
//     const mergedData = top10Gainers.concat(top10Losers);
    
//     console.log("Top 10 Highest Profit Stocks:");
//     console.log(gainers);
//     setBSEData(mergedData)
    
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
//  }


//  //console.log(nifty50Data)
// //  const getX = nifty50.find(obj=>obj.TATAMOTORS)?.TATAMOTORS
// //  console.log(getX.beta)

// const logout = () =>{
//   localStorage.removeItem("sessionToken");
//   return location.reload()
// }
  

//   useEffect(()=>{
//     if (typeof window !== 'undefined') {
//       if(localStorage.getItem("theme")==="true"){
//         setIsDark(true)
//       }else if(localStorage.getItem("theme")==="false"){
//         setIsDark(false)
//       }else{
//         return
//       }
//     }

//     if (typeof window !== 'undefined') {
//       if(localStorage.getItem("sessionToken")!=="" ){
//         Authenticate()
//         getUserData()
//       }else{
//         return
//       }
//     }
//       businessNews()
//       getIndices()
//       getIndicesData()
//       getMoreIndicesData()
//       bankSector()
//       allNSEData()
//       allBSEData()
//       const mergedArray = NSEData.concat(BSEData);
//       setAllIndex([...AllIndex,...mergedArray])

      
      
      
//       // const observer = new IntersectionObserver(
//       //   (entries) => {
//       //     entries.forEach((entry) => {
//       //       if (entry.isIntersecting) {
//       //         // Load Highcharts when the element is visible
              
//       //         //observer.unobserve(entry.target);
//       //       }
//       //     });
//       //   },
//       //   { threshold: 0.1 } // Adjust the threshold as needed
//       // );

//       // document.body.className = testtheme;
        
      
//   },[isDark])

//   const collapseItems = [
//     "Features",
//     "Customers",
//     "Pricing",
//     "Company",
//     "Legal",
//     "Team",
//     "Help & Feedback",
//     "Login",
//     "Sign Up",
//   ];

  
//   return (
//     <NextThemesProvider
//     defaultTheme="system"
//     attribute="class"
//     value={{
//       light: lightTheme.className,
//       dark: darkTheme.className
//     }}
//   >
//     <NextUIProvider theme={isDark ? darkTheme : lightTheme}>
//       <div>
//         <div className="scrolling-line-container">
//           <div className="scrolling-line">
//             {/* {scrollingText} */}
//             {(NSEData).map(abc=>{
//               return(
//                 <div className='scrolling-align' key={abc.name}>
//                     <p key={abc.name}><b>{abc.name}</b> <Image src={abc.profit >=0 ? Up : Down} width={15}></Image> <b style={{color:abc.profit>=0 ? "green" : "red"}}>{((abc.profit/abc.close)*100).toFixed(2)}%</b> </p>
//                 </div>
                
//               )
//             })}
//           </div>
//         </div>

//         <div className="scrolling-line-container2">
//           <div className="scrolling-line2">
//             {/* {scrollingText} */}
//             {(BSEData).map(abc=>{
//               return(
//                 <div className='scrolling-align2' key={abc.name}>
//                     <p key={abc.name}><b>{abc.name}</b> <Image src={abc.profit >=0 ? Up : Down} width={15}></Image> <b style={{color:abc.profit>=0 ? "green" : "red"}}>{((abc.profit/abc.close)*100).toFixed(2)}%</b> </p>
//                 </div>
                
//               )
//             })}
//           </div>
//         </div>

        
//       <Navbar shouldHideOnScroll isBordered variant={"static"} css={{width:"100%", backgroundColor:"$background"}}>
//       <Navbar.Toggle showIn="xs" aria-label="toggle navigation" />
//         <Navbar.Brand>
//         <box-icon name='trending-up' color='#1aae30' ></box-icon>
//         <Text b>GrowthIN</Text>
          
//         </Navbar.Brand>
//         <Navbar.Content hideIn="xs">
//         <Dropdown flat light color="default">
//           <Dropdown.Button light color="default">Features</Dropdown.Button>
//           <Dropdown.Menu aria-label="Static Actions">
//             <Dropdown.Item key="new"><Button auto light color="default" onClick={abc=>{screener()}}>Screener</Button></Dropdown.Item>
//             <Dropdown.Item key="copy"><Button auto light color="default" onClick={abc=>{supercharts()}}>SuperCharts</Button></Dropdown.Item>
              
//           </Dropdown.Menu>
//         </Dropdown>
//           <Navbar.Link href="#">Customers</Navbar.Link>
//           <Navbar.Link href="#">Pricing</Navbar.Link>
//           <Navbar.Link href="#">Company</Navbar.Link>
//           {!load && <Navbar.Link color="inherit" href="#">
//           <Link href={'/signup'}>Signup</Link>
//           </Navbar.Link>}
//           {load ?  
//           <Dropdown placement="bottom-left">
//           <Dropdown.Trigger>
//               <Avatar
//               color="default"
//               bordered
//               text={(userData.user_name).slice(0,2)}
//               zoomed
//               size="md"
//             />
//           </Dropdown.Trigger>
//           <Dropdown.Menu color="default" aria-label="Avatar Actions">
//             <Dropdown.Item key="profile" css={{ height: "$18" }}>
//               <Text b color="inherit" css={{ d: "flex" }}>
//                 Signed in as
//               </Text>
//               <Text b color="inherit" css={{ d: "flex" }}>
//                 {userData.email}
//               </Text>
//             </Dropdown.Item>
//             <Dropdown.Item key="settings" withDivider>
//               My Settings
//             </Dropdown.Item>
//             <Dropdown.Item key="team_settings">Team Settings</Dropdown.Item>
//             <Dropdown.Item key="analytics" withDivider>
//               Analytics
//             </Dropdown.Item>
//             <Dropdown.Item key="system">System</Dropdown.Item>
//             <Dropdown.Item key="configurations">Configurations</Dropdown.Item>
//             <Dropdown.Item key="help_and_feedback" withDivider>
//               Help & Feedback
//             </Dropdown.Item>
//             <Dropdown.Item key="logout" color="error" withDivider css={{textAlign:"start" ,paddingRight:"100px",display:"flex"}}>
              
//                 <Button onClick={abc=>logout()} size="xs" color="error" light css={{ fontSize:"$md",marginRight:"$1"}}>Logout</Button>
                
              
//             </Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>
          
//           : 
//           <Navbar.Item>
//             <Button auto flat href="#">
//             <Link href={'/login'}>Login</Link>
//             </Button>
//           </Navbar.Item>}

//         </Navbar.Content>
       

//         <Navbar.Content>
//         <Navbar.Item>
//           <Switch
//           checked={!isDark}
//           onChange={(e) => testsetTheme(e.target.checked ? 
//             abc=>
//             {setIsDark(false)
//               localStorage.setItem("theme",false)
//             } : 
//             abc=>
//             {setIsDark(true)
//               localStorage.setItem("theme",true)
//             })}
//           size="xl"
//           iconOn={<SunIcon filled />}
//           iconOff={<MoonIcon filled />}
//         />
            
//           </Navbar.Item>
//         </Navbar.Content>
//         <Navbar.Collapse css={{
//         }}>
//         {collapseItems.map((item, index) => (
//           <Navbar.CollapseItem key={item}>
//             <Link
//               color="inherit"
//               css={{
//                 width:"100%",
        
              
//               }}
//               href="#"
//             >
//               {item}
//             </Link>
//           </Navbar.CollapseItem>
//         ))}
//       </Navbar.Collapse>
//       </Navbar>
//         </div>
//     <div className='startpage'>
//       <div className='midstartpage'>

//         <div className='topSearchSec'>
      
//           <div className='startpgpic'>
//             <div className='mainimg'>
//               <LazyLoadImage
//                 alt='homeimg'
//                 src='https://images.pexels.com/photos/355770/pexels-photo-355770.jpeg?cs=srgb&dl=pexels-pixabay-355770.jpg&fm=jpg'
//                 effect='blur'
                
//               />
//             </div>
            
//                   {/* <img src="https://images.pexels.com/photos/355770/pexels-photo-355770.jpeg?cs=srgb&dl=pexels-pixabay-355770.jpg&fm=jpg"></img> */}
//                 </div>

//             <div className='search'>
              
//                 <div className='subSearch'>
                        
//                 <Autocomplete
//                     disablePortal
//                     id="combo-box-demo"
                    
//                     options={stock}
//                     getOptionLabel={option => option.label}
//                     sx={{ width: 300}}

//                     onInputChange={handleChange}
//                     renderInput={(params) => 
//                     <TextField 
                      
//                       {...params} 
//                       variant="outlined"
        
//                       label="Search Stock"
                      
//                       />}
//                       renderOption={(props, option) => (
//                         <li {...props} className="MuiAutocomplete-option" >
//                           <p style={{ color: '#16181A' }}>{option.label}</p>
//                         </li>
//                       )}
//                   />
//                     <IconButton aria-label="search" size="large">
//                       <Search onClick={travel} fontSize="inherit"/>
//                     </IconButton>

//                 </div>
//             </div>
               
//             </div>
     
     
        

          
        
    
     
//      <div className='indicestitle'>
//         <h1><b>Indices</b></h1>
//         {/* <h2>Counter : {counter}</h2> */}
//      </div>
    
    
//       <div className='indices'>
//       <hr></hr>
//       <div className='indiceInfo'>
//             <h1>Nifty 50 - {data1.symbol}</h1>
//                 <div className='subindiceInfo'>
//                   <p>High : {data1.high}</p>
//                   <p>Low : {data1.low}</p>
//                   <p>Open : {data1.open}</p>
//                   <p>Close : {data1.prevClose}</p>
//                 </div>
                
//             </div>

//         <div className='subindices'> 
        
//         <HighchartsReact
            
//             highcharts={Highcharts}
//             constructorType={'stockChart'}
//             options={areachart1}
//             containerProps={{ style: { height: '500px' } }}
//           /> 
           
          
            
    
            
//         </div>
//         <div className='indextable'>
//           {/* <CollapsibleTable data={nifty50Data} itemsPerPage={5} mode={isDark}/> */}
//           <Box sx={{ height: nifty50Data!="" ? "auto" : "500px", width: '100%',color:isDark?"white":"black" }} >
//               <DataGrid
//                   rows={nifty50Data}
//                   columns={columns}
//                   initialState={{
//                   pagination: {
//                       paginationModel: {
//                       pageSize: 5,
                      
//                       },
//                   },
//                   }}
//                   sx={{
//                       color:isDark?"white":"black"
//                   }}
//                   pageSizeOptions={[5,10, 25,100]}
                  
//                   disableRowSelectionOnClick
//               />
//           </Box>
//         </div>
        
// <hr></hr>
//                 <div className='indiceInfo2'>
//                  <h1>Nifty Bank - {data2.symbol}</h1> 
//                     <div className='subindiceInfo'>
//                       <p>High : {data2.high}</p>
//                       <p>Low : {data2.low}</p>
//                       <p>Open : {data2.open}</p>
//                       <p>Close : {data2.prevClose}</p>
//                     </div>
//                 </div>
       
//         <div className='subindices2'>

//                     <div className='subindicesChart'>
//                    <HighchartsReact
//                         highcharts={Highcharts}
//                         constructorType={'stockChart'}
//                         options={areachart2}
//                         containerProps={{ style: { height: '500px' } }}
//                       />  
           
          
//                       </div>
              

                
//         </div>
//         <div className='indextable'>
//           {/* <CollapsibleTable data={bankData} itemsPerPage={11} mode={isDark}/> */}
//           <Box sx={{ height: bankData!="" ? "auto" : "500px", width: '100%',color:isDark?"white":"black" }} >
//               <DataGrid
//                   rows={bankData}
//                   columns={columns}
//                   initialState={{
//                   pagination: {
//                       paginationModel: {
//                       pageSize: 5,
                      
//                       },
//                   },
//                   }}
//                   sx={{
//                       color:isDark?"white":"black"
//                   }}
//                   pageSizeOptions={[5,10, 25,100]}
                  
//                   disableRowSelectionOnClick
//               />
//           </Box>
//         </div>
//         <hr></hr>
//         <div className='indiceInfo'>
//             <h1>Sensex - {data3.symbol}</h1>
//                 <div className='subindiceInfo'>
//                   <p>High : {data3.high}</p>
//                   <p>Low : {data3.low}</p>
//                   <p>Open : {data3.open}</p>
//                   <p>Close : {data3.prevClose}</p>
//                 </div>
                
//             </div>
//         <div className='subindices'> 
        
        
       
//             <div className='subindicesChart'>
//              <HighchartsReact
//                 highcharts={Highcharts}
//                 constructorType={'stockChart'}
//                 options={areachart3}
//                 containerProps={{ style: { height: '500px' } }}
//               />
              
              
//             </div>
     
           
          

//         </div>

        
      
    
//       </div>

// <div className='news'>
//     <h1><b>Today&apos;s Headlines</b></h1>
//               <hr></hr>
//       <div className='buisnessNews'>
        
//               {bNews}
//       </div>
// </div>
      

//       <div className='timedetails'>
//             <small>Last Updated : {Date()}</small>
//             <br></br>
//             <small>Data by <b>Yahoo Finance</b></small>
//         </div>

//       </div>
//       <div className='extra'>
//         <br></br>
//       </div>
      
    
      
      
//     </div>
//     </NextUIProvider>
//     </NextThemesProvider>
   
//   )
  return(
    <div>
      <SSRfreeHome/>
      
      </div>
  )
}
