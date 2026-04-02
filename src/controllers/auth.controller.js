const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require("dotenv").config();


const loginUser=async (req,res,next)=>{
    try{
      const {email,password}=req.body;
     
      if(!email || !password){
        return res.status(400).json({
          success:false,
          message:"Please provide both email and password."
        })
      }
      console.log(email, password)
      let user = await User.findOne({email});

      if(!user){
        return res.status(404).json({
          success:false,
          message:"User not found!"
        })
      }
      console.log(await bcrypt.compare(password,user.password),password,user.password)
      
      if(await bcrypt.compare(password,user.password)){
        return res.status(401).json({
          success:false,
          message:"Invalid Credentials"
        })
      }

      let payload={
        id:user._id,
        username:user.username
      }
      let secret_key=process.env.JWT_SECRET

      let option={
        expiresIn: '1h'
      }

       const options = {
          expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
          httpOnly: true, // Prevent XSS: JS cannot read this
          secure: process.env.NODE_ENV === 'production', // Encrypted connection only (HTTPS)
          // sameSite: 'strict' // Optional: Protects against CSRF
        };

      let token = jwt.sign(payload,secret_key,option);

      res.status(200)
      .cookie('token',token,options)
      .json({
        success:true,
        message:"Hurray! User logged-In Successfully...!!!",
        // token
      })

    }catch(err){
        next(err)
    }
}


// const loginUser=async(req,res,next)=>{
//   try {
//     let {email,password} = req.body;
//     if (!email && !password){
//       return res.status(400).json({
//         success:false,
//         error:{message:"Please provide both email and password."}
//       })
//     };

//     const user=await User.findOne({email});

//     if(!user){
//       return res.status(404).json({
//         success:false,
//         error:{message:"User Not found"}
//       })
//     }

//     const res=await bcrypt.compare(password, user.password);
//     console.log(res);
//   } catch (error) {
//     console.log(err)
//   }
  
// }

const practiceTokenGeneration=(req,res,next)=>{

  try{
    let payload = {
      id:"696hwbdhbdhewbf",
      role:"admin",
      username:"abcd1"
    }
    let secretKey=process.env.JWT_SECRET;
    
    const options = {
  expiresIn: '1h' // Token will be valid for 1 hour
};
    let token = jwt.sign(payload,secretKey,options);
    res.status(200).json({
      success:true,
      message:"Successfully created a token using JWT",
      TOKEN:token
    })
  }catch(err){
      next(err)
  }
  
}

const registerUser = async (req, res, next) => {
  // 1. Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;

    // 2. Check if a user with this email already exists
    let user = await User.findOne({ email });
    if (user) {
      // 409 Conflict is the appropriate status code for a duplicate resource
      // return res.status(409).json({
      //   success: false,
      //   error: { message: 'A user with this email already exists.' }
      // });
      throw new Error("email dup")
    }

    // 3. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Create the new user with the HASHED password
    user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 5. Send a successful response
    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    // Pass any other unexpected errors to the global error handler
    next(error);
  }
};

module.exports = {
  registerUser,practiceTokenGeneration,loginUser
};