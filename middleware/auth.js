const jwt = require('jsonwebtoken')
const config = process.env

const verefyToken = (req,res,next) =>{
    console.log(req.headers["x-access-token"])
    const token =  req.body.token || req.query.token || req.headers["x-access-token"]

    if(!token){
        return res.status(403).json('a token is required for auth')
    }
    try{
        const decoded = jwt.verify(token, config.TOKEN_KEY)
        req.user = decoded;
    }catch(err){
        return res.status(401).json("invalid Token")
    }
    return next();
};

module.exports  = verefyToken