const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoute')
const messageRoute = require('./routes/messagesRoute')
const socket = require('socket.io')



const app = express()


app.use(cors({
    origin:["https://chat-adams.netlify.app"],
    credentials: true,
}))
app.use(express.json())
app.use('/chat/user/auth', userRoutes)
app.use('/chat/user/message', messageRoute)

const PORT = process.env.PORT || 5000


mongoose.connect("mongodb+srv://chat:chat@cluster0.vhrl4rs.mongodb.net/chat-adams?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('BD connectée');
}).catch(err=>{
    console.log(err);
})

const server = app.listen(PORT,()=>{
    console.log(`server lancer sur le server ${PORT}`);
})


const io = socket(server,{
    cors:{
        origin: "https://chat-adams.netlify.app",
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