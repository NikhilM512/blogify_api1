
const express = require("express");
const postsRoutes = require('./routes/posts.routes.js')

const app = express();

app.use(express.json());

const PORT = 3000;

app.get('/',(req,res)=>{
    res.status(200).send("Welcome to the Blogify API!")
})


app.use('/api/v1/posts',postsRoutes);


app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`)
})

// const http = require('http');

// let server = http.createServer((req,res)=>{
//     // console.log("Server is running on http://localhost:3000")
//     res.writeHead(200,{'content-type':'text/plain'});
//     res.end('Hello, World!');
// });

// server.listen(3000);
