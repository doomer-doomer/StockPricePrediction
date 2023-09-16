"use client"

import dynamic from "next/dynamic"
//import CheckAuth from "../../../components/authComp"

const CheckAuth = dynamic(()=>import('../../../components/authComp'),{ssr:false});

export default function Authenticate(){

   return (
    <div>
      <CheckAuth/>
    </div>
   )
}