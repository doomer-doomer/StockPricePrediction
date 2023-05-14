const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req,res,next){

    const token = req.header("statusToken");
    
    if(!token){
        return res.status(401).json({msg:"Authorisation Denied"});
    }

    //Verify
    try {
        const payload = jwt.verify(token,process.env.STATUS_KEY);
        req.user = payload.user;
        next();
    } catch (error) {
        res.status(401).json({msg:"Token is not Valid!"});
    }
}