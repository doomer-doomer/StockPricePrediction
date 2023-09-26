const Pool = require('pg').Pool;

const pool = new Pool({
    user:"postgres",
    password:"Mm0RDHuBT0AYfQO0SGKA",
    host:" containers-us-west-68.railway.app",
    port:"5741",
    database:"railway"
})

module.exports=pool;
