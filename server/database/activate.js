const jwt = require('jsonwebtoken');
require('dotenv').config();

function statusGen(user_id){
    const payload={
        user:user_id
    };
    return jwt.sign(payload,process.env.STATUS_KEY,{expiresIn:"5m"});
}

module.exports = statusGen;