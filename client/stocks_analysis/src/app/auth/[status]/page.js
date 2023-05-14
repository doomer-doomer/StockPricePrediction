"use client"

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Authenticate(){
    const path = usePathname();
    const [status,setstatus] = useState("")

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
                return setstatus("Something went wrong")
            }
            if(res===true){
                setstatus("Email validated Successfully!")
                
            }
        } catch (error) {
            console.error(error.message)
        }
    }
    useEffect(()=>{

        validateMail();
        console.log(path.slice(6,));
    },[])
    return(
        <div>
            <div>
                <h1>{status}</h1>
            </div>
        </div>
    )
}