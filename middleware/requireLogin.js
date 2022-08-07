const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req,res,next)=>{
    //extracting Bearers token from header
    const {authorization} = req.headers
    
    //if token exists
    if(!authorization){
        return res.status(401).json({error:"You must be logged in"})
    }
    
    //trim token to get auth keys
    const token = authorization.replace("Bearer ","")
    
    //verifying to get user from token
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"You must be logged in"})
        }
        //finding id and User using that id
        const {_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()
        })
        
    })
}
