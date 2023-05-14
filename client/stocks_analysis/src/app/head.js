import Link from "next/link";
import React, { useEffect, useState } from 'react';

export default function Head(){

    const [color,setcolor] = useState("whitesmoke");

    const theme = mycolor =>{
        setcolor(mycolor)
    }
    
    return(
        <div className="header">
            <div className="title">
                <h1>Mock Trading</h1>
            </div>
            <div className="loc">
                <Link href={'/login'}>Login</Link>
                <button onClick={()=>{theme("whitesmoke")}}>Day</button>
                <button onClick={()=>{theme("blue")}}>Night</button>
            </div>
        </div>
    )
}