const express = require("express");
const postsRoutes = require('./routes/posts.routes.js')
const cors = require("cors");
const app = express();
const connectDB = require("./config/db.js");
const mongoose = require("mongoose");
const User = require("./models/users.model.js");
const bcrypt = require("bcrypt");
const productModel = require("./models/product.model.js");
const { Tag } = require("./models/post.model.js");

require("dotenv").config();
// const userRoutes = require("./routes/users.routes.js")

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 7000;


connectDB();


app.get('/', (req, res) => {
    res.status(200).send("Welcome to the Blogify API!")
})


app.use('/api/v1/posts', postsRoutes);

app.post('/api/v1/tags',async (req,res,next)=>{
  try{
    let {name,description} = req.body;
    
    let tag = await new Tag({name,description});
    tag.save();
    res.status(201).json(tag)
  }catch(err){
      next(err)
  }
})

// app.use("/api/v1/user",userRoutes);

app.post("/api/v1/users",async(req,res,next)=>{
    try{
      const {username,firstName,lastName,email,password,DOB} = req.body;
      
      let sending_data={username,firstName,lastName,email,password,DOB};
      // let data=await User.create(sending_data);
      
      const user = new User(sending_data);
      user.firstName = 'Alice';
      user.lastName ="Johnson";
      await user.save();
      
      console.log(user.fullName);
      res.status(201).json({"Message":"Successfully posted the Data",data:user})
    }catch(err){
        next(err);
    }
});


app.post("/api/v1/products",async(req,res,next)=>{
    try{
      const {name,price,description} = req.body;
      // let saltRounds = 10; 
      // const hashedPassword = await bcrypt.hash(password,saltRounds)
      let sending_data={name,price,description};
      let data=await productModel.create(sending_data);
      console.log(data)
      res.status(201).json({"Message":"Successfully posted the Data",data})
    }catch(err){
        next(err)
    }
});


app.get('/api/v1/users',async(req,res,next)=>{
  try{
    const user = await User.findOne({fullName:"Aligf Xyz9"});
    console.log(user.fullName)
    res.status(200).json({data:user})
  }catch(err){
    next(err)
  }
})


app.get('/api/v1/products',async(req,res)=>{
  try{
    let users = await productModel.find({})
    res.status(200).json({data:users})
  }catch(err){
    next(err)
  }
});


app.post("/api/v1/products",async(req,res,next)=>{
    try{
      const {name} = req.body;
      // let saltRounds = 10
      // const hashedPassword = await bcrypt.hash(password,saltRounds)
      let sending_data={name};
      let data=await productModel.create(sending_data);
      res.status(201).json({"Message":"Successfully posted the Data",data})
    }catch(err){
        next(err)
    }
});



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


