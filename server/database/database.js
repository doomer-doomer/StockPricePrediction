const Pool = require('pg').Pool;

const pool = new Pool({
    user:"postgres",
    password:"tejas94843",
    host:"localhost",
    port:"5432",
    database:"Stock"
})

module.exports=pool;
