const jwt = require("jsonwebtoken");
require("dotenv").config();

const Protect=(req,res,next)=>{

    try{


        let token;
        if(req.cookies.token){
            token = req.cookies.token
        }else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized to access this route' });
        }

    // let authHeaders=req.headers.authorization && req.headers.authorization.startsWith('Bearer');

    // // 'Bearer ${token}'
    // if(!authHeaders){
    //      return res.status(401).json({
    //     success: false,
    //     message: "Not authorized, no token provided"
    //   });
    // }
    // let token = req.headers.authorization.split(' ')[1];
    
    let decoded=jwt.verify(token,process.env.JWT_SECRET);
    console.log(decoded);
    
    req.user=decoded;

    next();

    }catch(err){
        res.status(401).json({
            success:false,
            message:"Not authorized, token failed"
        })
    }
}


module.exports = {Protect};