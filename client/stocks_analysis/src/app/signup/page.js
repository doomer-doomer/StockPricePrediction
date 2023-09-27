"use client"

import '../signup/signup.css'

import React,{ useEffect, useState } from "react"
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button, Grid, Loading } from "@nextui-org/react";
import { Dropdown,Text } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { NextUIProvider } from '@nextui-org/react';
import { createTheme } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const lightTheme = createTheme({
    type: 'light',
    
  })
  
  const darkTheme = createTheme({
    type: 'dark',
    colors:{
      modes: {
        dark: {
          background: '#16181A', // Set your desired background color here
          // ... other dark theme configuration
        },
      },
    }
    
  })

export default function LoginPage(){

    

    const [isDark, setIsDark] = useState(false);
    const [load,setload]=useState(false)
    const [cred,setcred]= useState({
        user_name:"",
        email:"",
        password:"",
        user_age:"",
        gender:"",
        contact:"",
        contact:"",
        country:""
    })

    const [selected, setSelected] = React.useState(new Set(["Gender"]));
    const [selectedCountry, setSelectedCountry] = React.useState(new Set(["Country"]));


   
    const [checkpass,setpass]=useState("")
    const router = useRouter();

    function displaySuccessToast(msg){
        toast.success(
            msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: !isDark?"light":"dark",
                
                }
        )
    }

    function displayErrorToast(msg){
        toast.error(
            msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: !isDark?"light":"dark",
                
                }
        )
    }
    async function Authenticate(){
        try {
            const token = localStorage.getItem("sessionToken")
            const response = await fetch("http://localhost:5002/auth",{
                method:"POST",
                headers: { Authorization: `Bearer ${token}`,
                    sessionToken: token
                },
            })

            const res = await response.json();
            if(res==="Verified"){
                router.push('/')
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    async function submit(e){
        e.preventDefault();
    
        if(cred.user_name ==="" || cred.email==="" || cred.password===""){
            setload(false)
            return displayErrorToast("Insufficient Detials")
        }
        if(cred.password === checkpass){
            try {
                const body = cred
                const response = await toast.promise(fetch("http://localhost:5002/signup",{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify(body)
                }),{
                    pending:"Creating Account...",
                    success:"Confirmation Pending",
                    error:"Failed to create account!"
                })
    
                const reply = await response.json()
                if(!response.ok){
                    setload(false)
                    return displayErrorToast(reply)
                }

                localStorage.setItem('sessionToken',reply.sessionToken)
                router.push('/auth');
            } catch (error) {
                setload(false)
                console.error(error.message)
            }
        }
    }

    useEffect(()=>{
        Authenticate()
        if(localStorage.getItem("theme")==="true"){
            setIsDark(true)
          }else if(localStorage.getItem("theme")==="false"){
            setIsDark(false)
          }else{
            return
          }

          const selectedValue = Array.from(selected).join(", ").replaceAll("_", " ");
          
          const selectedValueCountry = Array.from(selectedCountry).join(", ").replaceAll("_", " ");

          setcred((prevCred) => ({
            ...prevCred,
            country:selectedValueCountry,
            gender:selectedValue
          }));

         
    
    },[selected,selectedCountry])
    return(
        <NextThemesProvider
        defaultTheme="system"
        attribute="class"
        value={{
        light: lightTheme.className,
        dark: darkTheme.className
        }}
         >
            <ToastContainer/>
        <NextUIProvider theme={isDark ? darkTheme : lightTheme}>
        <div className="reglay">
            <div className="regbox">
                <h1>Signup</h1>
                <form onSubmit={submit}>
                        <Input 
                        bordered 
                        
                        width="250px"
                        labelPlaceholder="Username" 
                        color="default"
                        type="text"
                        value={cred.user_name}
                        onChange={(e)=>setcred({
                            ...cred,
                            user_name:e.target.value
                        })}
                        />
                   
                        <Input 
                        bordered 
                        
                        width="250px"
                        labelPlaceholder="Email" 
                        color="default"
                        type="email"
                        value={cred.email}
                        onChange={(e)=>setcred({
                            ...cred,
                            email:e.target.value
                        })}
                        />
                       
                       <Input.Password 
                        bordered 
                        
                        width="250px"
                        labelPlaceholder="Password" 
                        color="default"
                        type="password"
                        value={cred.password}
                        onChange={(e)=>setcred({
                            ...cred,
                            password:e.target.value
                        })}
                        />
                        
                        <Input.Password 
                        bordered 
                        
                        width="250px"
                        labelPlaceholder="Re-type Password" 
                        color="default"
                        type="password"
                        value={checkpass}
                        onChange={(e)=>setpass(
                           e.target.value
                        )}
                        />
                        
                        <Input 
                        bordered 
                        
                        width="250px"
                        labelPlaceholder="Age" 
                        color="default"
                        type="number"
                        value={cred.user_age}
                        onChange={(e)=>setcred({
                            ...cred,
                            user_age:e.target.value
                        })}
                        />
                        
                    
                        <Input 
                        bordered 
                        
                        width="250px"
                        labelPlaceholder="Contact" 
                        color="default"
                        type="number"
                        value={cred.contact}
                        onChange={(e)=>setcred({
                            ...cred,
                            contact:e.target.value
                        })}
                        />

                    
                    <Dropdown>
                            <Dropdown.Button color="default" bordered css={{height:"42px",width:"254px",borderColor:"$accents4",color:"$accents6"}} className='custom-button' >
                                
                                {cred.gender}
                               
                                
                            </Dropdown.Button>
                            <Dropdown.Menu
                                aria-label="Single selection actions"
                                color="default"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={selected}
                                onSelectionChange={setSelected}
                            >
                                <Dropdown.Item key="M">M</Dropdown.Item>
                                <Dropdown.Item key="F">F</Dropdown.Item>
                                
                            </Dropdown.Menu>
                            </Dropdown>
                     
                        


                        <Dropdown>
                            <Dropdown.Button color="default" auto light bordered css={{height:"42px",width:"254px",borderColor:"$accents4",color:"$accents6",textAlign:'left',textAlignLast:"left"}}>
                                {cred.country}
                            </Dropdown.Button>
                            <Dropdown.Menu
                                aria-label="Single selection actions"
                                color="default"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={selectedCountry}
                                onSelectionChange={setSelectedCountry}
                                
                            >
                                <Dropdown.Item key="Afghanistan">Afghanistan</Dropdown.Item>
                                <Dropdown.Item key="AlandIslands">Åland Islands</Dropdown.Item>
                                <Dropdown.Item key="Albania">Albania</Dropdown.Item>
                                <Dropdown.Item key="Algeria">Algeria</Dropdown.Item>
                                <Dropdown.Item key="AmericanSamoa">American Samoa</Dropdown.Item>
                                <Dropdown.Item key="Andorra">Andorra</Dropdown.Item>
                                <Dropdown.Item key="Angola">Angola</Dropdown.Item>
                                <Dropdown.Item key="Anguilla">Anguilla</Dropdown.Item>
                                <Dropdown.Item key="Antarctica">Antarctica</Dropdown.Item>
                                <Dropdown.Item key="Antigua&Barbuda">Antigua & Barbuda</Dropdown.Item>
                                <Dropdown.Item key="Argentina">Argentina</Dropdown.Item>
                                <Dropdown.Item key="Armenia">Armenia</Dropdown.Item>
                                <Dropdown.Item key="Aruba">Aruba</Dropdown.Item>
                                <Dropdown.Item key="Australia">Australia</Dropdown.Item>
                                <Dropdown.Item key="Austria">Austria</Dropdown.Item>
                                <Dropdown.Item key="Azerbaijan">Azerbaijan</Dropdown.Item>
                                <Dropdown.Item key="Bahamas">Bahamas</Dropdown.Item>
                                <Dropdown.Item key="Bahrain">Bahrain</Dropdown.Item>
                                <Dropdown.Item key="Bangladesh">Bangladesh</Dropdown.Item>
                                <Dropdown.Item key="Barbados">Barbados</Dropdown.Item>
                                <Dropdown.Item key="Belarus">Belarus</Dropdown.Item>
                                <Dropdown.Item key="Belgium">Belgium</Dropdown.Item>
                                <Dropdown.Item key="Belize">Belize</Dropdown.Item>
                                <Dropdown.Item key="Benin">Benin</Dropdown.Item>
                                <Dropdown.Item key="Bermuda">Bermuda</Dropdown.Item>
                                <Dropdown.Item key="Bhutan">Bhutan</Dropdown.Item>
                                <Dropdown.Item key="Bolivia">Bolivia</Dropdown.Item>
                                <Dropdown.Item key="Bonaire,SintEustatius&Saba">Caribbean Netherlands</Dropdown.Item>
                                <Dropdown.Item key="Bosnia&Herzegovina">Bosnia & Herzegovina</Dropdown.Item>
                                <Dropdown.Item key="Botswana">Botswana</Dropdown.Item>
                                <Dropdown.Item key="BouvetIsland">Bouvet Island</Dropdown.Item>
                                <Dropdown.Item key="Brazil">Brazil</Dropdown.Item>
                                <Dropdown.Item key="BIOT">British Indian Ocean Territory</Dropdown.Item>
                                <Dropdown.Item key="BruneiDarussalam">Brunei</Dropdown.Item>
                                <Dropdown.Item key="Bulgaria">Bulgaria</Dropdown.Item>
                                <Dropdown.Item key="BurkinaFaso">Burkina Faso</Dropdown.Item>
                                <Dropdown.Item key="Burundi">Burundi</Dropdown.Item>
                                <Dropdown.Item key="Cambodia">Cambodia</Dropdown.Item>
                                <Dropdown.Item key="Cameroon">Cameroon</Dropdown.Item>
                                <Dropdown.Item key="Canada">Canada</Dropdown.Item>
                                <Dropdown.Item key="CapeVerde">Cape Verde</Dropdown.Item>
                                <Dropdown.Item key="CaymanIslands">Cayman Islands</Dropdown.Item>
                                <Dropdown.Item key="CentralAfricanRepublic">Central African Republic</Dropdown.Item>
                                <Dropdown.Item key="Chad">Chad</Dropdown.Item>
                                <Dropdown.Item key="Chile">Chile</Dropdown.Item>
                                <Dropdown.Item key="China">China</Dropdown.Item>
                                <Dropdown.Item key="ChristmasIsland">Christmas Island</Dropdown.Item>
                                <Dropdown.Item key="CocosIslands">Cocos (Keeling) Islands</Dropdown.Item>
                                <Dropdown.Item key="Colombia">Colombia</Dropdown.Item>
                                <Dropdown.Item key="Comoros">Comoros</Dropdown.Item>
                                <Dropdown.Item key="Congo">Congo - Brazzaville</Dropdown.Item>
                                <Dropdown.Item key="Congo,DemocraticRepublic of the Congo">Congo - Kinshasa</Dropdown.Item>
                                <Dropdown.Item key="CookIslands">Cook Islands</Dropdown.Item>
                                <Dropdown.Item key="CostaRica">Costa Rica</Dropdown.Item>
                                <Dropdown.Item key="CoteD'Ivoire">Côte d’Ivoire</Dropdown.Item>
                                <Dropdown.Item key="Croatia">Croatia</Dropdown.Item>
                                <Dropdown.Item key="Cuba">Cuba</Dropdown.Item>
                                <Dropdown.Item key="Curacao">Curaçao</Dropdown.Item>
                                <Dropdown.Item key="Cyprus">Cyprus</Dropdown.Item>
                                <Dropdown.Item key="CzechRepublic">Czechia</Dropdown.Item>
                                <Dropdown.Item key="Denmark">Denmark</Dropdown.Item>
                                <Dropdown.Item key="Djibouti">Djibouti</Dropdown.Item>
                                <Dropdown.Item key="Dominica">Dominica</Dropdown.Item>
                                <Dropdown.Item key="DominicanRepublic">Dominican Republic</Dropdown.Item>
                                <Dropdown.Item key="Ecuador">Ecuador</Dropdown.Item>
                                <Dropdown.Item key="Egypt">Egypt</Dropdown.Item>
                                <Dropdown.Item key="ElSalvador">El Salvador</Dropdown.Item>
                                <Dropdown.Item key="Equatorial Guinea">Equatorial Guinea</Dropdown.Item>
                                <Dropdown.Item key="Eritrea">Eritrea</Dropdown.Item>
                                <Dropdown.Item key="Estonia">Estonia</Dropdown.Item>
                                <Dropdown.Item key="Ethiopia">Ethiopia</Dropdown.Item>
                                <Dropdown.Item key="Falkland Islands (Malvinas)">Falkland Islands (Islas Malvinas)</Dropdown.Item>
                                <Dropdown.Item key="Faroe Islands">Faroe Islands</Dropdown.Item>
                                <Dropdown.Item key="Fiji">Fiji</Dropdown.Item>
                                <Dropdown.Item key="Finland">Finland</Dropdown.Item>
                                <Dropdown.Item key="France">France</Dropdown.Item>
                                <Dropdown.Item key="French Guiana">French Guiana</Dropdown.Item>
                                <Dropdown.Item key="French Polynesia">French Polynesia</Dropdown.Item>
                                <Dropdown.Item key="French Southern Territories">French Southern Territories</Dropdown.Item>
                                <Dropdown.Item key="Gabon">Gabon</Dropdown.Item>
                                <Dropdown.Item key="Gambia">Gambia</Dropdown.Item>
                                <Dropdown.Item key="Georgia">Georgia</Dropdown.Item>
                                <Dropdown.Item key="Germany">Germany</Dropdown.Item>
                                <Dropdown.Item key="Ghana">Ghana</Dropdown.Item>
                                <Dropdown.Item key="Gibraltar">Gibraltar</Dropdown.Item>
                                <Dropdown.Item key="Greece">Greece</Dropdown.Item>
                                <Dropdown.Item key="Greenland">Greenland</Dropdown.Item>
                                <Dropdown.Item key="Grenada">Grenada</Dropdown.Item>
                                <Dropdown.Item key="Guadeloupe">Guadeloupe</Dropdown.Item>
                                <Dropdown.Item key="Guam">Guam</Dropdown.Item>
                                <Dropdown.Item key="Guatemala">Guatemala</Dropdown.Item>
                                <Dropdown.Item key="Guernsey">Guernsey</Dropdown.Item>
                                <Dropdown.Item key="Guinea">Guinea</Dropdown.Item>
                                <Dropdown.Item key="Guinea-Bissau">Guinea-Bissau</Dropdown.Item>
                                <Dropdown.Item key="Guyana">Guyana</Dropdown.Item>
                                <Dropdown.Item key="Haiti">Haiti</Dropdown.Item>
                                <Dropdown.Item key="HeardIsland&Mcdonald Islands">Heard & McDonald Islands</Dropdown.Item>
                                <Dropdown.Item key="HolySee">Vatican City</Dropdown.Item>
                                <Dropdown.Item key="Honduras">Honduras</Dropdown.Item>
                                <Dropdown.Item key="HongKong">Hong Kong</Dropdown.Item>
                                <Dropdown.Item key="Hungary">Hungary</Dropdown.Item>
                                <Dropdown.Item key="Iceland">Iceland</Dropdown.Item>
                                <Dropdown.Item key="India">India</Dropdown.Item>
                                <Dropdown.Item key="Indonesia">Indonesia</Dropdown.Item>
                                <Dropdown.Item key="Iran">Iran</Dropdown.Item>
                                <Dropdown.Item key="Iraq">Iraq</Dropdown.Item>
                                <Dropdown.Item key="Ireland">Ireland</Dropdown.Item>
                                <Dropdown.Item key="IsleofMan">Isle of Man</Dropdown.Item>
                                <Dropdown.Item key="Israel">Israel</Dropdown.Item>
                                <Dropdown.Item key="Italy">Italy</Dropdown.Item>
                                <Dropdown.Item key="Jamaica">Jamaica</Dropdown.Item>
                                <Dropdown.Item key="Japan">Japan</Dropdown.Item>
                                <Dropdown.Item key="Jersey">Jersey</Dropdown.Item>
                                <Dropdown.Item key="Jordan">Jordan</Dropdown.Item>
                                <Dropdown.Item key="Kazakhstan">Kazakhstan</Dropdown.Item>
                                <Dropdown.Item key="Kenya">Kenya</Dropdown.Item>
                                <Dropdown.Item key="Kiribati">Kiribati</Dropdown.Item>
                                <Dropdown.Item key="Korea, Democratic People's Republic of">North Korea</Dropdown.Item>
                                <Dropdown.Item key="Korea, Republic of">South Korea</Dropdown.Item>
                                <Dropdown.Item key="Kosovo">Kosovo</Dropdown.Item>
                                <Dropdown.Item key="Kuwait">Kuwait</Dropdown.Item>
                                <Dropdown.Item key="Kyrgyzstan">Kyrgyzstan</Dropdown.Item>
                                <Dropdown.Item key="Lao">Laos</Dropdown.Item>
                                <Dropdown.Item key="Latvia">Latvia</Dropdown.Item>
                                <Dropdown.Item key="Lebanon">Lebanon</Dropdown.Item>
                                <Dropdown.Item key="Lesotho">Lesotho</Dropdown.Item>
                                <Dropdown.Item key="Liberia">Liberia</Dropdown.Item>
                                <Dropdown.Item key="Libyan Arab Jamahiriya">Libya</Dropdown.Item>
                                <Dropdown.Item key="Liechtenstein">Liechtenstein</Dropdown.Item>
                                <Dropdown.Item key="Lithuania">Lithuania</Dropdown.Item>
                                <Dropdown.Item key="Luxembourg">Luxembourg</Dropdown.Item>
                                <Dropdown.Item key="Macao">Macao</Dropdown.Item>
                                <Dropdown.Item key="Macedonia, the Former Yugoslav Republic of">North Macedonia</Dropdown.Item>
                                <Dropdown.Item key="Madagascar">Madagascar</Dropdown.Item>
                                <Dropdown.Item key="Malawi">Malawi</Dropdown.Item>
                                <Dropdown.Item key="Malaysia">Malaysia</Dropdown.Item>
                                <Dropdown.Item key="Maldives">Maldives</Dropdown.Item>
                                <Dropdown.Item key="Mali">Mali</Dropdown.Item>
                                <Dropdown.Item key="Malta">Malta</Dropdown.Item>
                                <Dropdown.Item key="Marshall Islands">Marshall Islands</Dropdown.Item>
                                <Dropdown.Item key="Martinique">Martinique</Dropdown.Item>
                                <Dropdown.Item key="Mauritania">Mauritania</Dropdown.Item>
                                <Dropdown.Item key="Mauritius">Mauritius</Dropdown.Item>
                                <Dropdown.Item key="Mayotte">Mayotte</Dropdown.Item>
                                <Dropdown.Item key="Mexico">Mexico</Dropdown.Item>
                                <Dropdown.Item key="Micronesia, Federated States of">Micronesia</Dropdown.Item>
                                <Dropdown.Item key="Moldova, Republic of">Moldova</Dropdown.Item>
                                <Dropdown.Item key="Monaco">Monaco</Dropdown.Item>
                                <Dropdown.Item key="Mongolia">Mongolia</Dropdown.Item>
                                <Dropdown.Item key="Montenegro">Montenegro</Dropdown.Item>
                                <Dropdown.Item key="Montserrat">Montserrat</Dropdown.Item>
                                <Dropdown.Item key="Morocco">Morocco</Dropdown.Item>
                                <Dropdown.Item key="Mozambique">Mozambique</Dropdown.Item>
                                <Dropdown.Item key="Myanmar">Myanmar (Burma)</Dropdown.Item>
                                <Dropdown.Item key="Namibia">Namibia</Dropdown.Item>
                                <Dropdown.Item key="Nauru">Nauru</Dropdown.Item>
                                <Dropdown.Item key="Nepal">Nepal</Dropdown.Item>
                                <Dropdown.Item key="Netherlands">Netherlands</Dropdown.Item>
                                <Dropdown.Item key="Netherlands Antilles">Curaçao</Dropdown.Item>
                                <Dropdown.Item key="New Caledonia">New Caledonia</Dropdown.Item>
                                <Dropdown.Item key="New Zealand">New Zealand</Dropdown.Item>
                                <Dropdown.Item key="Nicaragua">Nicaragua</Dropdown.Item>
                                <Dropdown.Item key="Niger">Niger</Dropdown.Item>
                                <Dropdown.Item key="Nigeria">Nigeria</Dropdown.Item>
                                <Dropdown.Item key="Niue">Niue</Dropdown.Item>
                                <Dropdown.Item key="NorfolkIsland">Norfolk Island</Dropdown.Item>
                                <Dropdown.Item key="NorthernMarianaIslands">Northern Mariana Islands</Dropdown.Item>
                                <Dropdown.Item key="Norway">Norway</Dropdown.Item>
                                <Dropdown.Item key="Oman">Oman</Dropdown.Item>
                                <Dropdown.Item key="Pakistan">Pakistan</Dropdown.Item>
                                <Dropdown.Item key="Palau">Palau</Dropdown.Item>
                                <Dropdown.Item key="Palestinian">Palestine</Dropdown.Item>
                                <Dropdown.Item key="Panama">Panama</Dropdown.Item>
                                <Dropdown.Item key="Papua New Guinea">Papua New Guinea</Dropdown.Item>
                                <Dropdown.Item key="Paraguay">Paraguay</Dropdown.Item>
                                <Dropdown.Item key="Peru">Peru</Dropdown.Item>
                                <Dropdown.Item key="Philippines">Philippines</Dropdown.Item>
                                <Dropdown.Item key="Pitcairn">Pitcairn Islands</Dropdown.Item>
                                <Dropdown.Item key="Poland">Poland</Dropdown.Item>
                                <Dropdown.Item key="Portugal">Portugal</Dropdown.Item>
                                <Dropdown.Item key="Puerto Rico">Puerto Rico</Dropdown.Item>
                                <Dropdown.Item key="Qatar">Qatar</Dropdown.Item>
                                <Dropdown.Item key="Reunion">Réunion</Dropdown.Item>
                                <Dropdown.Item key="Romania">Romania</Dropdown.Item>
                                <Dropdown.Item key="Russian Federation">Russia</Dropdown.Item>
                                <Dropdown.Item key="Rwanda">Rwanda</Dropdown.Item>
                                <Dropdown.Item key="SaintBarthelemy">St. Barthélemy</Dropdown.Item>
                                <Dropdown.Item key="SaintHelena">St. Helena</Dropdown.Item>
                                <Dropdown.Item key="SaintKitts&Nevis">St. Kitts & Nevis</Dropdown.Item>
                                <Dropdown.Item key="SaintLucia">St. Lucia</Dropdown.Item>
                                <Dropdown.Item key="SaintMartin">St. Martin</Dropdown.Item>
                                <Dropdown.Item key="SaintPierre&Miquelon">St. Pierre & Miquelon</Dropdown.Item>
                                <Dropdown.Item key="SaintVincent&Grenadines">St. Vincent & Grenadines</Dropdown.Item>
                                <Dropdown.Item key="Samoa">Samoa</Dropdown.Item>
                                <Dropdown.Item key="SanMarino">San Marino</Dropdown.Item>
                                <Dropdown.Item key="SaoTome&Principe">São Tomé & Príncipe</Dropdown.Item>
                                <Dropdown.Item key="SaudiArabia">Saudi Arabia</Dropdown.Item>
                                <Dropdown.Item key="Senegal">Senegal</Dropdown.Item>
                                <Dropdown.Item key="Serbia">Serbia</Dropdown.Item>
                                <Dropdown.Item key="Serbia&Montenegro">Serbia</Dropdown.Item>
                                <Dropdown.Item key="Seychelles">Seychelles</Dropdown.Item>
                                <Dropdown.Item key="SierraLeone">Sierra Leone</Dropdown.Item>
                                <Dropdown.Item key="Singapore">Singapore</Dropdown.Item>
                                <Dropdown.Item key="SintMaarten">Sint Maarten</Dropdown.Item>
                                <Dropdown.Item key="Slovakia">Slovakia</Dropdown.Item>
                                <Dropdown.Item key="Slovenia">Slovenia</Dropdown.Item>
                                <Dropdown.Item key="SolomonIslands">Solomon Islands</Dropdown.Item>
                                <Dropdown.Item key="Somalia">Somalia</Dropdown.Item>
                                <Dropdown.Item key="SouthAfrica">South Africa</Dropdown.Item>
                                <Dropdown.Item key="SouthGeorgia">South Georgia & South Sandwich Islands</Dropdown.Item>
                                <Dropdown.Item key="SouthSudan">South Sudan</Dropdown.Item>
                                <Dropdown.Item key="Spain">Spain</Dropdown.Item>
                                <Dropdown.Item key="SriLanka">Sri Lanka</Dropdown.Item>
                                <Dropdown.Item key="Sudan">Sudan</Dropdown.Item>
                                <Dropdown.Item key="Suriname">Suriname</Dropdown.Item>
                                <Dropdown.Item key="Svalbard&JanMayen">Svalbard & Jan Mayen</Dropdown.Item>
                                <Dropdown.Item key="Swaziland">Eswatini</Dropdown.Item>
                                <Dropdown.Item key="Sweden">Sweden</Dropdown.Item>
                                <Dropdown.Item key="Switzerland">Switzerland</Dropdown.Item>
                                <Dropdown.Item key="Syrian">Syria</Dropdown.Item>
                                <Dropdown.Item key="Taiwan">Taiwan</Dropdown.Item>
                                <Dropdown.Item key="Tajikistan">Tajikistan</Dropdown.Item>
                                <Dropdown.Item key="Tanzania">Tanzania</Dropdown.Item>
                                <Dropdown.Item key="Thailand">Thailand</Dropdown.Item>
                                <Dropdown.Item key="TimorLeste">Timor-Leste</Dropdown.Item>
                                <Dropdown.Item key="Togo">Togo</Dropdown.Item>
                                <Dropdown.Item key="Tokelau">Tokelau</Dropdown.Item>
                                <Dropdown.Item key="Tonga">Tonga</Dropdown.Item>
                                <Dropdown.Item key="Trinidad&Tobago">Trinidad & Tobago</Dropdown.Item>
                                <Dropdown.Item key="Tunisia">Tunisia</Dropdown.Item>
                                <Dropdown.Item key="Turkey">Turkey</Dropdown.Item>
                                <Dropdown.Item key="Turkmenistan">Turkmenistan</Dropdown.Item>
                                <Dropdown.Item key="Turks&CaicosIslands">Turks & Caicos Islands</Dropdown.Item>
                                <Dropdown.Item key="Tuvalu">Tuvalu</Dropdown.Item>
                                <Dropdown.Item key="Uganda">Uganda</Dropdown.Item>
                                <Dropdown.Item key="Ukraine">Ukraine</Dropdown.Item>
                                <Dropdown.Item key="UAE">United Arab Emirates</Dropdown.Item>
                                <Dropdown.Item key="UK">United Kingdom</Dropdown.Item>
                                <Dropdown.Item key="US">United States</Dropdown.Item>
                                <Dropdown.Item key="USMinor Outlying Islands">U.S. Outlying Islands</Dropdown.Item>
                                <Dropdown.Item key="Uruguay">Uruguay</Dropdown.Item>
                                <Dropdown.Item key="Uzbekistan">Uzbekistan</Dropdown.Item>
                                <Dropdown.Item key="Vanuatu">Vanuatu</Dropdown.Item>
                                <Dropdown.Item key="Venezuela">Venezuela</Dropdown.Item>
                                <Dropdown.Item key="VietNam">Vietnam</Dropdown.Item>
                                <Dropdown.Item key="VirginIslands,British">British Virgin Islands</Dropdown.Item>
                                <Dropdown.Item key="VirginIslands,US">U.S. Virgin Islands</Dropdown.Item>
                                <Dropdown.Item key="Wallis&Futuna">Wallis & Futuna</Dropdown.Item>
                                <Dropdown.Item key="WesternSahara">Western Sahara</Dropdown.Item>
                                <Dropdown.Item key="Yemen">Yemen</Dropdown.Item>
                                <Dropdown.Item key="Zambia">Zambia</Dropdown.Item>
                                <Dropdown.Item key="Zimbabwe">Zimbabwe</Dropdown.Item>
                                
                            </Dropdown.Menu>
                            </Dropdown>
          

                            {load ? 
                            <Button disabled auto bordered color="primary" css={{ width:"255px" }}>
                                <Loading color="currentColor" size="sm" />
                            </Button> : 
                            <Button color="primary" shadow type="submit" css={{ width:"255px" }}>Register</Button>}
                </form>

                <p>Already have an account?</p>
                <Link href="/login">Login</Link>
            </div>
            
        </div>
        </NextUIProvider>
        </NextThemesProvider>
    )
}