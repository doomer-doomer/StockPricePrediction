"use client"

import React,{useState,useEffect} from 'react'
import Highcharts from 'highcharts/highstock';
import sand from 'highcharts/themes/sand-signika';
import dynamic from 'next/dynamic'
const HighchartsReact = dynamic(() => import('highcharts-react-official'), {
    ssr: false, // This disables SSR for this component
  });

  sand(Highcharts);

export default function AreaChart(props){

    const areachartOptions = {
        rangeSelector: {
          selected: 5,
          buttonTheme: {
            fill: props.isDark ? "#FFFFFF" : "#16181A",
                stroke: 'none',
                'stroke-width': 0,
                r: 8,
                style: {
                    color: props.isDark ? "#16181A" : "#ECEDEE",
                    fontWeight: 'bold'
                },
                states: {
                    hover: {
                      fill: props.isDark ? "#16181A" : "#ECEDEE",
                        style: {
                            color: props.isDark ? "#FFFFFF" : "#16181A"
                        }
                    },
                    select: {
                        fill: props.isDark ? "#16181A" : "#ECEDEE",
                        style: {
                            color: props.isDark ? "#FFFFFF" : "#16181A"
                        }
                    }
                    // disabled: { ... }
                }
            },
            labelStyle: {
              color: props.isDark ? "#ECEDEE" : "#16181A",
              fontWeight: 'bold'
          },
        },
        chart:{
          style:{
            backgroundColor:props.isDark ? "black" : "white"
          },
          scrollbar: {
            enabled: false
          }
        },
        navigator:{
          enabled:false,
         
        },
        yAxis:[
          {
            gridLineWidth: 0,
          }
        ],
        series: [
          {
            name: props.name,
            type:props.type,
            data:props.data.map(obj=>
              [new Date(obj.Date).getTime(),obj.Close]
            ),
            
            tooltip: {
              valueDecimals: 2
            },
            fillColor: {
              linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1
              },
              stops: [
                  [0, props.color],
                  [1, props.darkcolor]
              ]
          },
          color:props.color,
          }, 
        ],
      };
    return (
        <HighchartsReact
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={areachartOptions}
                containerProps={{ style: { height: '150px',width:"300px" } }}
              /> 
    )

}