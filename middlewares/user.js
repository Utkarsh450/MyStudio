const jwt = require("jsonwebtoken");
const userModel=  require("../models/user");
module.exports.protect = async (req,res,next) =>{
    if(req.cookies.token){
        try{
        const data = jwt.verify(req.cookies.token,process.env.JWT_SECRET); // here you will get in data is {email,iat}        
        
        req.user =  await userModel.findOne({email:data.email}).select("-password");
        next();
    }catch(err){
            res.status(401).send("Not Authorised");

        }
    }
    if(!req.cookies.token){
        res.status(401).send("Not Authorised, plzz login to Start Chatting");
    }
}
// jwt.verify gives three things header data and ?