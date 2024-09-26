const express = require("express");
const { brotliDecompress } = require("zlib");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http,{
    cors: {
        origin: "*"
    }
})

const users = {};
http.listen(8000,function() {
    console.log("Server started..");
    io.on("connection",function(socket){
        socket.on('new-user-joined',name => {
            // console.log("new user", name)
            users[socket.id] = name;
            socket.broadcast.emit('user-joined', name);
        });
        socket.on('send',message =>{
            socket.broadcast.emit('receive', {message,name:users[socket.id]})
        });
        socket.on('disconnect', message => {
            socket.broadcast.emit('left',users[socket.id]);
            delete users[socket.id];
        }) 
    })
    
});