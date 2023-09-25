"use client"

import { useState,useEffect } from "react"
import { usePathname } from "next/navigation"

export default function PaymentGatewayComponent(){

    const path = usePathname();
    const [userInfo,setuserInfo] = useState({
        key: "rzp_test_TqPDYxminnYkHL", // Enter the Key ID generated from the Dashboard
        amount: "", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "GrowthIN", //your business name
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: "", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
        prefill: { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
            name: "Tejas Gotavade", //your customer's name
            email: "tejas@gmail.com",
            contact: "734283324" //Provide the customer's phone number for better conversion rates 
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    })

    async function getTransaction(){
        try {
            const body = {"id":path.slice(12)}
            const response = await fetch('http://localhost:5002/getrequest',
            {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(body)
            })

            const getData = await response.json()
            setuserInfo({
                ...userInfo,
                order_id:getData.id,
                amount:getData.amount,
            })
            console.log(getData)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(()=>{
        console.log(path.slice(12))
        getTransaction()
    },[])

    return (
        <div>
            <h1>Working</h1>
        </div>
    )
}