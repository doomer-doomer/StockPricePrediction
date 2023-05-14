const jwt = require('jsonwebtoken');
require('dotenv').config();

function sessionGen(user_id){
    const payload={
        user:user_id
    };
    return jwt.sign(payload,process.env.SESSION_KEY,{expiresIn:"24h"});
}

module.exports = sessionGen;