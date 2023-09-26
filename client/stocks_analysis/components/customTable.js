"use client"

import { Image } from "@nextui-org/react";
import Up from '../src/app/arrow-up.png';
import Dowm from '../src/app/down.png';
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
            <p>{props.name}</p>
            </div>
            <div>

            </div>
            <Image src={(props.price - props.close)>0 ? Up : Dowm } width={25}></Image>
            <p>{props.price}</p>
            <box-icon name='link-external' color='#ffffff' onClick={abc=>teleport(props.symbol)}></box-icon>
            <hr></hr>
        </div>
    )
}