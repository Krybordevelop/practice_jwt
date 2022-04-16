const jwt = require('jsonwebtoken')
const config = process.env

const verefyToken = (req,res,next) =>{
    console.log(req.headers["authorization"])
    const token =  req.body.token || req.query.token || req.headers["authorization"]

    if(!token){
        return res.status(403).json('a token is required for auth')
    }
    try{
        console.log(token.split(' ')[1])
        const decoded = jwt.verify(token.split(' ')[1], config.TOKEN_KEY)
        req.user = decoded;
    }catch(err){
        return res.status(401).json("invalid Token")
    }
    return next();
};

module.exports  = verefyToken