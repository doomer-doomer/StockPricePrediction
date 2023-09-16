"use client"

import '../login/login.css'

import { Input } from "@nextui-org/react";
import { useState,useEffect } from "react"
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button, Grid, Loading } from "@nextui-org/react";

import { NextUIProvider } from '@nextui-org/react';
import { createTheme } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from 'next-themes';

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

export default function LoginPage(){

    const [isDark, setIsDark] = useState(false);
    const [load,setload]=useState(false)
    const router = useRouter()
    const [cred,setcred] = useState({
        email:"",
        password:""
    });

    async function auth(){
        try {
            const token = localStorage.getItem("sessionToken")
            const response = await fetch("http://localhost:5002/auth",{
                method:"POST",
                headers: { Authorization: `Bearer ${token}`,
                    sessionToken: token
                },
            })

            console.log(token)

            const res = await response.json();
            if(!response.ok){
                return ;
            }
            if(res==="Verified"){
                router.push('/')
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    async function submit(e){
        e.preventDefault();
        setload(true)
        console.log(cred)
        if(cred.email==="" || cred.password===""){
            setload(false)
            return alert("Incomplete Credetials")
        }
        try {
            const body = cred
            const response = await fetch("http://localhost:5002/login",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(body)
            })

            const reply = await response.json()
            if(!response.ok){
                setload(false)
                return alert(reply)
            }
            setload(false)
            localStorage.setItem('sessionToken',reply.sessionToken)
            setTimeout(abc=>{router.push('/')},3000)

        } catch (error) {
            setload(false)
            console.error(error.message)
        }
    }

    useEffect(()=>{
        auth()
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
        <div className="loginlay">
            <div className="loginbox">
                <h1>Login</h1>
                    <form onSubmit={submit}>
                    <Input 
                        bordered 
                        clearable
                        width="250px"
                        labelPlaceholder="Email" 
                        color="default"
                        type="text"
                        value={cred.email}
                        onChange={(e)=>setcred({
                            ...cred,
                            email:e.target.value
                        })}
                        />
                    
                        <Input.Password
                        bordered 
                        clearable
                        width="250px"
                        labelPlaceholder="Password" 
                        color="default"
                        type="text"
                        value={cred.password}
                        onChange={(e)=>setcred({
                            ...cred,
                            password:e.target.value
                        })}
                
                        />
                        

                        {load ? 
                        <Button disabled auto bordered color="primary" css={{ px: "$20" }}>
                            <Loading color="currentColor" size="sm" />
                        </Button> : 
                        <Button color="primary" shadow type="submit">Login</Button>}
                    </form>
                    <p>Don&apos;t have an account?</p>
                    <Link href="/signup">Register</Link>
            </div>
        </div>
        </NextUIProvider>
        </NextThemesProvider>
    )
}