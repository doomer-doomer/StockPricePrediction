"use client"

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Grid, Loading } from "@nextui-org/react";
import { Dropdown,Text } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { NextUIProvider } from '@nextui-org/react';
import { createTheme } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import "../[status]/status.css"
import "boxicons"

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

export default function Authenticate(){
    const path = usePathname();
    const [status,setstatus] = useState("")
    const [load,setload] = useState(false)
    const [logo,setlogo] = useState(false)
    const [btncol,setbtncol] = useState("primary")
    
    const [isDark, setIsDark] = useState(false);

    async function validateMail(){
        try {
            const token = path.slice(6,);
            const response = await fetch("http://localhost:5002/mailauth",{
                method:"POST",
                headers: { Authorization: `Bearer ${token}`,
                    statusToken: token
                },
            })

            const res = await response.json();
            if(!response.ok){
                document.getElementById("statusBox").style.boxShadow = "0px 8px 100px 40px rgba(243,18,96,0.3)"
                document.getElementById("status").style.color = "#F31260"
                setbtncol("error")
                return setstatus("Something went wrong")
            }
            if(res===true){
                setstatus("Email validated Successfully!")
                document.getElementById("statusBox").style.boxShadow = "0px 8px 100px 40px rgba(23,201,100,0.3)"
                document.getElementById("status").style.color = "#17C964"
                setbtncol("success")
                setlogo(true)
            }
        } catch (error) {
            console.error(error.message)
        }
    }
    useEffect(()=>{

        validateMail();
        console.log(path.slice(6,));
        
        if(localStorage.getItem("theme")==="true"){
            setIsDark(true)
          }else if(localStorage.getItem("theme")==="false"){
            setIsDark(false)
          }else{
            return
          }
    },[])
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
        <div className='statusLay' id='statusLay'>
            <div className='statusBox' id='statusBox'>
              {load ? 
                  <Button size="xl" disabled light auto color="primary" css={{ px: "$20" }}>
                    <Loading color="currentColor" size="lg" />
                  </Button>
                :

                <div>
                    {logo ? <box-icon size="lg" name='check-double' color='#17c964' ></box-icon> : 
                    <box-icon size="lg" name='minus-circle' type='solid' color='#f31260' ></box-icon>
                    }
                    <h1 id='status'>{status}</h1>
                    <h3>Your verification is complete.</h3>
                    <br></br>
                  <Button color={btncol} size="md" onClick={abc=>validateMail()} shadow>Verify </Button>
                  
                </div>}
            </div>
        </div>
        </NextUIProvider>
        </NextThemesProvider>
    )
}