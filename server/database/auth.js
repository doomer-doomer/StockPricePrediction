const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req,res,next){

    const token = req.header("sessionToken");
    
    if(!token){
        return res.status(401).json("Authorisation Denied");
    }
    try {
        const payload = jwt.verify(token,process.env.SESSION_KEY);
        req.user = payload.user;
        next();
    } catch (error) {
        res.status(401).json("Token is not Valid!");
    }
}