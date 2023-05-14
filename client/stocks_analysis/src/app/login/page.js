"use client"

import { useState,useEffect } from "react"
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function LoginPage(){

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
        console.log(cred)
        if(cred.email==="" || cred.password===""){
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
                return alert(reply)
            }

            localStorage.setItem('sessionToken',reply.sessionToken)
        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(()=>{
        auth()
    },[])
    return(
        <div className="loginlay">
            <div className="loginbox">
                <h1>Login</h1>
                    <form onSubmit={submit}>
                        <label>Email
                            <input
                                type="text"
                                value={cred.email}
                                onChange={(e)=>setcred({
                                    ...cred,
                                    email:e.target.value
                                })}
                            />
                        </label>

                        <label>Password
                            <input
                                type="text"
                                value={cred.password}
                                onChange={(e)=>setcred({
                                    ...cred,
                                    password:e.target.value
                                })}
                            />
                        </label>

                        <button type="submit">Login</button>
                    </form>
                    <p>Don't have an account?</p>
                    <Link href="/signup">Register</Link>
            </div>
        </div>
    )
}