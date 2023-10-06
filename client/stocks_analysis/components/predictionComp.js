"use client"
import { useState,useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import Search from '@mui/icons-material/Search'
import stock from '../src/app/stock'
import '../src/app/stocks/predictions/prediction.css'
import 'boxicons'
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useRouter } from 'next/navigation';


export default function SSRfreeGotoPredictions(){
    
    const [script,setscript]=useState("");
    const [isDark, setIsDark] = useState(false);
    const router = useRouter();
   
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
        router.push(`/stocks/predictions/${script}`)
      }

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
    return (
       
       <div style={{width:'100%',height:"100vh"}}>
         <div className="predictionimg">
                <LazyLoadImage
                            src={isDark ? "https://e1.pxfuel.com/desktop-wallpaper/339/639/desktop-wallpaper-huawei-mediapad-m2-7-stock-1920px.jpg": "https://img.freepik.com/premium-photo/creative-curve-paper-abstract-background-design_851755-1291.jpg"}
                            effect="blur"
                            width="100%"
                            height="100vh"
                            alt='bg'
                        >
                        </LazyLoadImage>
                </div>
      
            <div style={
                {
                display:"flex",
                height:"95vh",
                width:'100%',
                justifyContent:"center",
                alignItems:'center', 
                
               }}>
                
               
                <div style={
                    {width:'700px',
                    border:'none',
                    borderRadius:'20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    backdropFilter: 'blur(10px)',
                    padding:'20px',
                    position:'relative',
                    overflow:'hidden',
                    zIndex:1,
                    margin:'15px',
                    marginTop:'45px'
                    }}>
                        
                       
                <h1>Welcome to Stock Prediction Center.</h1>
            
                <p>Unlock the future of stock trading with our advanced prediction algorithms.</p>
            
                <div style={{display:"flex",marginTop:"75px",marginBottom:'25px'}}>
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
                  
                    <small>*Stock investments carry inherent market risks. Please ensure you perform due diligence and consult with a financial advisor before making any investment decisions.</small>

                </div> 
                
            </div>
       </div>
    )
}