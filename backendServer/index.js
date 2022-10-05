import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import { userRouter } from "./Routers/users.js";
import { searchRouter } from "./Routers/search.js";
import { conversationRouter } from "./Routers/conversation.js";
import { conversationMeassagesRouter } from "./Routers/conversationMessages.js";
import {Server} from "socket.io";



const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;


const mongo_URL = process.env.Mongo_URL;

async function createConnection(){
    const client = new MongoClient(mongo_URL);
    await client.connect();
    console.log("MongoDB is connected");
    return client;
}

export const client = await createConnection();


app.get("/", (req,res)=>{
    res.send("Welcome to Chat application backend🎊")
})




app.use("/users",userRouter);
app.use("/search",searchRouter);
app.use("/conversation",conversationRouter);
app.use("/messages",conversationMeassagesRouter);


const server = app.listen(port,()=>console.log(`App has started in ${port}`));


const io = new Server(server,{
    cors: {
        origin: "*"
      }
});

let users = [];

const addUser = (userId,socketId)=>{
    !users.some((user)=>user.userId===userId) && users.push({userId,socketId})
};

const removeUser = (socketId)=>{
    users = users.filter((user)=>user.socketId !== socketId);
};

const getUser = (receiverId)=>{
    return users?.find((user)=>user.userId === receiverId);
}


io.on("connection", (socket) => {
    // console.log(socket);
    console.log("User connected");
    // io.emit("welcome","Hi Welcome to socket operation. This message is from socket server");
    socket.on("addUser",(userId)=>{
        console.log("userId",userId);
        addUser(userId,socket.id);
        console.log("user..........",users);
        io.emit("getUsersToClient",users);
    })
    

    socket.on("sendMessageFromClient",({senderId,receiverId,message})=>{
        const user = getUser(receiverId);
        console.log("Hi...............",receiverId,user,message);
        io.to(user?.socketId).emit("getMessageFromSocketServer",{senderId,message})
    })

    socket.on("disconnect",()=>{
        console.log("User disconnected");
        removeUser(socket.id);
        io.emit("getUsersToClient",users);
    })
  });

