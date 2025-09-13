const {Server}=require("socket.io")
const http=require("http")
const express=require("express")

const app=express()
const server=http.createServer(app)

const io=new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})

const userToSocketMap={};

function receiverSocketId(userid){
    return userToSocketMap[userid];
}

io.on("connection",(socket)=>{
    console.log("A user connected",socket.id)

    const userid=socket.handshake.query.userid;
    if(userid){
        userToSocketMap[userid]=socket.id;
        io.emit("getOnlineUsers",Object.keys(userToSocketMap))
    }

    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id)
        delete userToSocketMap[userid];
        io.emit("getOnlineUsers",Object.keys(userToSocketMap))
    })
})

module.exports={app,server,io,receiverSocketId}


