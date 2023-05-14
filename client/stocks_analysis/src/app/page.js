"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Head from './head';
import './startpg.css'


export default function Home() {
  const [script,setscript]=useState("");
  const router = useRouter();

  const travel = (e)=>{
    e.preventDefault();
    router.push(`/stocks/${script}`)
  }

  
  return (
    <div className='startpage'>
      <img></img>

      <div className='hearder'>
        <Head/>
      </div>
      <div className='search'>
        <form onSubmit={travel}>
          <h1>Search Stocks</h1>
          <input
            type='text'
            value={script}
            onChange={(e)=>setscript(e.target.value)}
            placeholder='INFY'
          ></input>

          <button type='submit'>Submit</button>


        </form>
      </div>
      
      
    </div>
   
  )
}
