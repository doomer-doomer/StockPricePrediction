import dynamic from 'next/dynamic'
const SSRfreeGotoPredictions = dynamic(()=>import('../../../../components/predictionComp'),{ssr:false});


export default function GotoPredictions(){
    
    return (
       
       <SSRfreeGotoPredictions/>
    )
}