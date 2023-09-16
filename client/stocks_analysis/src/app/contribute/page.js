"use client"

import React ,{useState,useEffect} from 'react'
import { Button, Input, Spacer } from "@nextui-org/react";
import Razorpay from 'razorpay';

export default function Subscriptions(){
    const [userInfo,setuserInfo] = useState({
        key: "rzp_test_TqPDYxminnYkHL", // Enter the Key ID generated from the Dashboard
        amount: "", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "GrowthIN", //your business name
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: "order_McfhSiVaVIDMhi", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
        prefill: { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
            name: "", //your customer's name
            email: "",
            contact: "" //Provide the customer's phone number for better conversion rates 
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    })

    function pay(e){
        e.preventDefault();
        const rzpay = new Razorpay(userInfo);
        rzpay.open();
    }
    return(
        <div>
            <h1>Contibute</h1>
            <div>
                <form onSubmit={pay}>
                    
                        <Input
                            labelPlaceholder='Name'
                            type="text"
                            value={userInfo.prefill.name}
                            onChange={(e)=>setuserInfo({
                                ...userInfo,
                                prefill:{
                                    ...userInfo.prefill,
                                    name:e.target.value
                                }
                            })}
                    />
                    
                        <Input
                            labelPlaceholder='Email'
                            type="email"
                            value={userInfo.prefill.email}
                            onChange={(e)=>setuserInfo({
                                ...userInfo,
                                prefill:{
                                    ...userInfo.prefill,
                                    email:e.target.value
                                }
                            })}
                    />

                        <Input
                            labelPlaceholder='Contact'
                            type="number"
                            value={userInfo.prefill.contact}
                            onChange={(e)=>setuserInfo({
                                ...userInfo,
                                prefill:{
                                    ...userInfo.prefill,
                                    contact:e.target.value
                                }
                            })}
                    />  
                    
                        <Input
                            labelPlaceholder='Contrinution Amount'
                            type="number"
                            value={userInfo.amount}
                            onChange={(e)=>setuserInfo({
                                ...userInfo,
                                amount:e.target.value
                            })}
                    />
                    <Button type="submit" color="success" shadow>Pay</Button>

                </form>
            </div>
        </div>
        
    )
}