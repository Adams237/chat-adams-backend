const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoute')
const messageRoute = require('./routes/messagesRoute')
const socket = require('socket.io')



const app = express()
require("dotenv").config()


app.use(cors())
app.use(express.json())
app.use('/chat/user/auth', userRoutes)
app.use('/chat/user/message', messageRoute)


mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('BD connectée');
}).catch(err=>{
    console.log(err);
})

const server = app.listen(process.env.PORT,()=>{
    console.log(`server lancer sur le server ${process.env.PORT}`);
})


const io = socket(server,{
    cors:{
        origin: "http://localhost:3000",
        credentials: true,
    }
})


global.onlineUsers = new Map()
io.on("connection",(socket)=>{
    global.chatSocket = socket,
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId, socket.id)
    })

    socket.on("send-msg", (data)=>{
        const sendUserSocket =  onlineUsers.get(data.to)
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve", data.message)
        }
    })
})