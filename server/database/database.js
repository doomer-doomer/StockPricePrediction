const Pool = require('pg').Pool;

const pool = new Pool({
    user:"oqvrjfym",
    password:"l_zoRNqG9cV7yyUpZG_6mRLNzIwIYNV2",
    host:"arjuna.db.elephantsql.com",
    // port:"5741",
    database:"oqvrjfym"
})

module.exports=pool;
