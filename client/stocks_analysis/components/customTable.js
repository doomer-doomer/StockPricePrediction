"use client"

import Image from 'next/image';
import Up from '../src/app/stocks/[data]/arrow-up.png';
import Down from '../src/app/stocks/[data]/down.png';
import 'boxicons'
import { useRouter } from "next/navigation";
import '../css/customTable.css';

export default function CustomTable(props){
    const router = useRouter();

    function teleport(e){
        router.push(`stocks/${e}`)
    }
    return (
        <div className="singlerow" style={{backgroundColor:props.isDark?  "#FFFFFF" : "#16181A"}}>
            <div>
            
            <p><b>{props.name}</b></p>
            </div>
            <div>

            </div>
            <div style={{display:'flex'}}>
            <Image src={ props.profit >=0 ? Up : Down } width={25} height={25} alt="abc"></Image>
            <p>{(props.price).toLocaleString('en-US')} ({(props.profit).toFixed(2)})</p>
            <box-icon style={{zIndex:4}} name='link-external' color={props.isDark?  "#16181A" : "#FFFFFF"} onClick={abc=>teleport(props.symbol)}></box-icon>
            </div>
           
        
        </div>
    )
}