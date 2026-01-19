
const http = require('http');


let server = http.createServer((req,res)=>{
    // console.log("Server is running on http://localhost:3000")
    res.writeHead(200,{'content-type':'text/plain'});
    res.end('Hello, World!');
});

server.listen(3000);
