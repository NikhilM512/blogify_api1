const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async()=>{

        try {
            let mongoURL=process.env.mongoURI
            let connection = await mongoose.connect(mongoURL)
            console.log("Successfully setup the connection with mongoDB");
            
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
}

module.exports=connectDB;