import express from "express";
import { client } from "../index.js";
import { ObjectId } from "bson";

const router = express.Router();


// Add a message to database

router.post("/addConversationMessage",async function(req,res){
    try{
        const {conversation_id,sender_id,message} = req.body;
        const messageSentTime = new Date();

        const updateConversation = await client.db("chatIon").collection("conversations").updateOne({_id : ObjectId(conversation_id)},{$set: {conversationLastUpdatedDate: messageSentTime, areConversationMessagesExists: true}});
        const addConversationMessageResult = await client.db("chatIon").collection("messages").insertOne({conversation_id,sender_id,message,messageSentTime});
        res.send(addConversationMessageResult);
    }catch(error){
        console.log("catch - addConversation error",error);
        res.status(500).send(error);
    }
})


//get messages of a single conversation

router.get("/:id",async function(req,res){
    try{
        const {id} = req.params;
        const userConversationMessages = await client.db("chatIon").collection("messages").find({conversation_id:id}).sort({messageSentTime: 1}).toArray();
        res.send(userConversationMessages);
    }catch(error){
        console.log("catch - getConversationMessages error",error);
        res.status(500).send(error);
    }
})




export const conversationMeassagesRouter = router;