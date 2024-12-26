const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const http = require('http');
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended:true}));
app.use(cookieParser());
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const mainRouter = require("./routes/main");
const chatRouter = require("./routes/chat");
const db = require("./config/mongoose");

app.set("view engine","ejs");
db();
let users = [];
let rooms = {};
io.on("connection",function(socket){
    socket.on("join",function(){
        if(users.length > 0 && users.length <=2){
            let partner = users.shift();
            let roomname = `${socket.id} - ${partner.id}`;
            socket.join(roomname);
            partner.join(roomname);
            console.log("Joined");
            
            io.to(roomname).emit("joinned", roomname);
        }
        else{
            users.push(socket);
        }
    })
    socket.on("message", function(data){
        socket.broadcast.to(data.room).emit("message", data.message);
    })
    socket.on("signalingMessage", function(data) {
        socket.broadcast.to(data.room).emit("signalingMessage", data.message);
    });
    socket.on("disconnect", function() {
        let index = users.findIndex(user => user.id === socket.id);
        if (index !== -1) {
            users.splice(index, 1);
        }
    });
    

})
app.use("/login",loginRouter);
app.use("/",mainRouter);
app.use("/chat",chatRouter);
app.use("/register",registerRouter);

server.listen(3004);