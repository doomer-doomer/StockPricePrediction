"use client"

import { useEffect, useState } from "react"



export default function validate(){

    const [status,setstatus]=useState("Sending Confirmation Mail");

    async function sendMail(){
        try {
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
            // localStorage.setItem("statusToken",res.token)
            
        } catch (error) {
            console.error(error.message);
        }
    }
    useEffect(()=>{
        sendMail()
    },[])
    return (
        <div>
            <div>
                <h1>Email send successfully!</h1>
            </div>
        </div>
    )
}