import { useEffect, useState } from "react"
import { Button, Grid, Loading } from "@nextui-org/react";
import { NextUIProvider } from '@nextui-org/react';
import { createTheme } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import "boxicons"
import "../src/app/auth/sendEmail.css"


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

export default function CheckAuth(){
    const [isDark, setIsDark] = useState(false);
    const [status,setstatus]=useState(false);

    async function sendMail(){
        try {
            setstatus(true)
            if (typeof window !== 'undefined') {
              const token = localStorage.getItem('sessionToken');
              if (!token) return;
              const response = await fetch("http://localhost:5002/verify",{
                  method:"POST",
                  headers: { Authorization: `Bearer ${token}`,
                  sessionToken: token
              },
              })

              const res = await response.json();
              if(!response.ok){
                  return;
              }
              setstatus(false)
              // localStorage.setItem("statusToken",res.token)
            }
            
        } catch (error) {
          setstatus(false)
            console.error(error.message);
        }
    }
    useEffect(()=>{
        sendMail()
        if (typeof window !== 'undefined') {
          if(localStorage.getItem("theme")==="true"){
              setIsDark(true)
            }else if(localStorage.getItem("theme")==="false"){
              setIsDark(false)
            }else{
              return
            }
        }
    },[]);

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
        <div className="sendEmailLay">
            <div className="sendBox">
                
                {status ? 
                  <Button size="xl" disabled light auto color="primary" css={{ px: "$20" }}>
                    <Loading color="currentColor" size="lg" />
                  </Button>
                :

                <div>
                  <box-icon size="lg" name='mail-send' ></box-icon>
                    <h1>Email send successfully!</h1>
                    <h3>Check your email for verification</h3>
                    <br></br>
                  <Button size="md" onClick={abc=>sendMail()} shadow>Resend</Button>
                  
                </div>}
                
            </div>
        </div>
        </NextUIProvider>
        </NextThemesProvider>
    )
}