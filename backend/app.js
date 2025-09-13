require("dotenv").config();
const express=require('express');
const cors=require("cors")
const cookieParser = require("cookie-parser");
const {app,server}=require("./lib/socket")
const path=require('path');
const connectDB=require('./lib/db');
const userRouter=require('./routes/users.routes');
const messageRouter=require('./routes/message.routes');


const __dirname=path.resolve();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));

app.use("/users",userRouter);
app.use("/messages",messageRouter);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    });
}


server.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});

