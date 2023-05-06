const cheerio = require("cheerio");
const axios = require("axios");
const express = require("express");
const cors = require("cors");

const app = express()

app.use(cors())
app.use(express.json())

app.post("/currentPrice",async(req,res)=>{
    const {script} = req.body;
    const scriptdata = await axios.request({
        method:"GET",
        url :`https://finance.yahoo.com/quote/${script}.NS?p=${script}.NS&.tsrc=fin-srch`,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
                }
    })

    const $ = cheerio.load(scriptdata.data);
    const price  = $("#quote-header-info").find('fin-streamer').html();
    res.json({price})
})


app.post("/price",async(req,res)=>{
    const {script} = req.body;
    const scriptdata = await axios.request({
        method:"GET",
        url :`https://finance.yahoo.com/quote/${script}.NS?p=${script}.NS&.tsrc=fin-srch`,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
                }
    })

    const $ = cheerio.load(scriptdata.data);

    const name  = $("#quote-header-info").find('h1').html();
    //const price  = $("#quote-header-info").find('fin-streamer').html();
    const prev_close = $('[data-test="PREV_CLOSE-value"]').parent('tr').find("td").next().html()
    const open = $('[data-test="OPEN-value"]').parent('tr').find("td").next().html()
    const volume = $('[data-test="TD_VOLUME-value"]').parent('tr').find("fin-streamer").html()
    const market_cap = $('[data-test="MARKET_CAP-value"]').parent('tr').find('td').next().html()
    const PEratio = $('[data-test="PE_RATIO-value"]').parent('tr').find('td').next().html() 
    
    res.json({name,prev_close,open,volume,market_cap,PEratio})
});

app.post('/profile',async(req,res)=>{
    const {script} = req.body;
    const profiledata = await axios.request({
        method:"GET",
        url :`https://finance.yahoo.com/quote/${script}.NS/profile?p=${script}.NS`,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
                }
    })

    const $$ = cheerio.load(profiledata.data);

    const sector = $$('[data-test="qsp-profile"]').find('p').next().find('span').next().html();
    const industry = $$('[data-test="qsp-profile"]').find('p').next().find('span').next().next().next().next().html();
    const description = $$('section.quote-sub-section').find('p').html()

    res.json({sector,industry,description})
    
})

app.post('/history',async(req,res)=>{
    const {script} = req.body;
    const history = await axios.request({
        method:"GET",
        url :`https://finance.yahoo.com/quote/${script}.NS/history?p=${script}.NS`,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
                }
    })

    const $$$ = cheerio.load(history.data);

    const arr = []

    const trail = $$$('td');
    trail.each(function (idx, el) {
        arr[idx] = $$$(el).find('span').html();
        //arr.push(`${idx}:${data}`)
        // arr.push({data})
      });
      var d1 = arr.slice(0,7);
      var d2 = arr.slice(7,14);
      var d3 = arr.slice(14,21);
      var d4 = arr.slice(21,28);
      var d5 = arr.slice(28,35);
      var d6 = arr.slice(35,42);
      var d7 = arr.slice(42,49);
      var d8 = arr.slice(49,56);
      var d9 = arr.slice(56,63);
      var d10 = arr.slice(63,70);
      var d11 = arr.slice(77,84);
      var d12 = arr.slice(84,91);
      var d13 = arr.slice(91,98);
      var d14 = arr.slice(98,105);
      var d15 = arr.slice(105,112);
      var d16 = arr.slice(112,119);

       var d17 = arr.slice(119,126);
      var d18 = arr.slice(133,140);
      var d19 = arr.slice(147,154);
      var d20 = arr.slice(154,161);
      var d21 = arr.slice(161,168);
      var d22 = arr.slice(168,175);
      var d23 = arr.slice(175,182);
      var d24 = arr.slice(182,189);
      var d25 = arr.slice(189,196);
      var d26 = arr.slice(196,203);
      var d27 = arr.slice(203,210);
      var d28 = arr.slice(210,217);
      var d29 = arr.slice(217,224);
      var d30 = arr.slice(224,231);
      var d31 = arr.slice(231,238);
      var d32 = arr.slice(238,245);

       var d33 = arr.slice(245,252);
      var d34 = arr.slice(252,259);
      var d35 = arr.slice(259,266);
      var d36 = arr.slice(266,273);
      var d37 = arr.slice(280,287);
      var d38 = arr.slice(287,294);
      var d39 = arr.slice(294,301);
      var d40 = arr.slice(301,308);
      var d41 = arr.slice(308,315);
      var d42 = arr.slice(315,322);
      var d43 = arr.slice(322,329);
      var d44 = arr.slice(329,336);
      var d45 = arr.slice(336,343);
      var d46 = arr.slice(343,350);
      var d47 = arr.slice(350,357);
      var d48 = arr.slice(357,364);
      var d49 = arr.slice(364,371);

      var d49 = arr.slice(371,378);
      var d50 = arr.slice(378,385);
      var d51 = arr.slice(385,392);
      var d52 = arr.slice(392,399);
      var d53 = arr.slice(399,406);
      var d54 = arr.slice(406,413);
      var d55 = arr.slice(413,420);
      var d56 = arr.slice(420,427);
      var d57 = arr.slice(427,434);
      var d58 = arr.slice(434,441);
      var d59 = arr.slice(441,448);
      var d60 = arr.slice(448,455);
      var d61 = arr.slice(455,462);
      var d62 = arr.slice(462,469);
      var d63 = arr.slice(469,476);
      var d64 = arr.slice(476,483);

       var d65 = arr.slice(483,490);
      var d66 = arr.slice(490,497);
      var d67 = arr.slice(497,504);
      var d68 = arr.slice(504,511);
      var d69 = arr.slice(511,518);
      var d70 = arr.slice(518,525);
      var d71 = arr.slice(525,532);
      var d72 = arr.slice(532,539);
      var d73 = arr.slice(539,546);
      var d74 = arr.slice(546,553);
      var d75 = arr.slice(553,560);
      var d76 = arr.slice(560,567);
      var d77 = arr.slice(567,574);
      var d78 = arr.slice(574,581);
      var d79 = arr.slice(581,588);
      var d80 = arr.slice(588,595);

       var d81 = arr.slice(595,602);
      var d82 = arr.slice(602,609);
      var d83 = arr.slice(609,616);
      var d84 = arr.slice(616,623);
      var d85 = arr.slice(623,630);
      var d86 = arr.slice(630,637);
      var d87 = arr.slice(637,644);
      
      
    res.json({d1,d2,d3,d4,d5,d6,d7,d8,d9,d10,d11,d12,d13,d14,d15,d16,d17,d18,d19,d20,d21,d22,d23,d24,d25,d26,d27,d28,d29,d30,d31,d32,d33,d34,d35,d36,d37,d38,d39,d40,d41,d42,d43,d44,d45,d46,d47,d48,d49,d50,d51,d52,d53,d54,d55,d56,d57,d58,d59,d60,d61,d62,d63,d64,d65,d66,d67,d68,d69,d70,d71,d72,d73,d74,d75,d76,d77,d78,d79,d80,d81,d82,d83,d84,d85,d86,d87});

    // const date = $$$('td').find('span').html();
    // const open = $$$('td').next().find('span').html();
    // const high = $$$('td').next().next().find('span').html();
    // const low = $$$('td').next().next().find('span').html();
    // const close = $$$('td').next().next().next().next().find('span').html();
    // const volume = $$$('td').next().next().next().next().next().next().find('span').html();

    // res.json({date,open,low,high,close,volume})
    
})

app.listen(5001,()=>{
    console.log("Server started successfully!")
})