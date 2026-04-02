const express = require("express");
const postsRoutes = require('./routes/posts.routes.js')
const cors = require("cors");
const app = express();
const connectDB = require("./config/db.js");
const mongoose = require("mongoose");
const User = require("./models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { Tag } = require("./models/post.model.js");
const mainRouter = require("./routes/index.js");
const cookieParser = require('cookie-parser');
require("dotenv").config();
 const { validationResult } = require('express-validator');
const { body } = require('express-validator');
const registrationRules = [
  // email must be a valid email
  body('email').isEmail().withMessage('Please provide a valid email address'),
  
  // password must be at least 5 chars long
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
];


app.use(cors());
app.use(express.json());
app.use(cookieParser());


const PORT = process.env.PORT || 7000;


connectDB();


app.post("/register",registrationRules,(req,res)=>{
    try {

        let {email,username,password}=req.body;
       

         const errors = validationResult(req);
  
  // 3. If there are errors, send a 400 Bad Request response
      if (!errors.isEmpty()) {
        // 400 Bad Request is the correct status code for a client-side validation error
        return res.status(400).json({ errors: errors.array() });
      }
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!emailRegex.test(email)) {
        //   return res.status(400).json({ msg: "Email is incorrect!" });
        // }

        // if (!/[A-Z]/.test(password)) {
        //   return res.status(400).json({ msg: "Password must contain at least one uppercase letter" });
        // }
        // if (!/[0-9]/.test(password)) {
        //   return res.status(400).json({ msg: "Password must contain at least one digit" });
        // }
        // if (!/[!@#$%^&*]/.test(password)) {
        //   return res.status(400).json({ msg: "Password must contain at least one special character" });
        // }

        // if(!email.includes('@')){
        //     res.status(400).json({"msg":"Email is incorrect!"})
        // }
        // if(password.length<8 || password.length>16){
        //     res.status(400).json({"Msg":"Password length should be between 8-16 characters"})
        // }

        res.send("Registered")

    } catch (error) {
      res.json({error:error.message})
    }
})


app.get('/', (req, res) => {
    res.status(200).send("Welcome to the Blogify API!")
})


app.use('/api/v1', mainRouter);




const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for the developer
  console.error(err,"g");

  // Mongoose Bad ObjectId -> CastError
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    return res.status(404).json({ success: false, error: { message } });
  }

  // Mongoose Duplicate Key Error -> MongoServerError
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    return res.status(400).json({ success: false, error: { message } });
  }

  // Mongoose Validation Error -> ValidationError
  if (err.name === 'ValidationError') {
    // The error object contains an array of specific validation errors
    const message = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ success: false, error: { message } });
  }

  if (err.status) {
    return res.status(err.status).json({
    success: false,
    error: { message: err.message }
  });
}

  // If it's none of the above, it's an unexpected server error.
  // This is our default "catch-all".
  res.status(500).json({
    success: false,
    error: { message: 'Internal Server Error' }
  });
};

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})


