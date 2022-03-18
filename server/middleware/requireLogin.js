const mongoose = require('mongoose');
const Questions = mongoose.model("Questions");
const jwt = require('jsonwebtoken');
const {JWT_SECRETKEY} = require('../valuekeys.js');

module.exports= (req,res,next)=>{
const {authorization} = req.headers;
if(!authorization){
    res.status(422).json({error:"login error"})
}
const token = authorization;
jwt.verify(token,JWT_SECRETKEY,(err,payload)=>{

    if(err){
     return res.status(401).json({error:"you must be logged in "})
}
const {_id} =payload
Questions.findById(_id).then(verifedUser=>{
    req.user = verifedUser;
    next();

})

})
    
}