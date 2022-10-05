import express from "express";
import { client } from "../index.js";
import { ObjectId } from "bson";

const router = express.Router();


// Add a conversation to database

router.post("/addConversation",async function(req,res){
    try{
        const {sender_id,receiver_id} = req.body;
        var conversationStartDate = "";
        var conversationLastUpdatedDate = "";
        var areConversationMessagesExists = false;

        const getExistingConversation = await client.db("chatIon").collection("conversations").find({$and:[{$or:[{sender_id : sender_id},{sender_id: receiver_id}]},{$or:[{receiver_id : sender_id},{receiver_id: receiver_id}]}]}).toArray();

        console.log("existing Conversation if any", getExistingConversation);

        if(!getExistingConversation.length){
            conversationStartDate = new Date();
            conversationLastUpdatedDate = new Date();
            const addConversationResult = await client.db("chatIon").collection("conversations").insertOne({sender_id,receiver_id,conversationStartDate,conversationLastUpdatedDate,areConversationMessagesExists});
            res.send(addConversationResult);
        }else{
            res.send({message:"Conversation already exists..."})
        }
    }catch(error){
        console.log("catch - addConversation error",error);
        res.status(500).send(error);
    }
})


//get conversation of a single person

router.get("/:id",async function(req,res){
    try{
        const {id} = req.params;
        const userConversation = await client.db("chatIon").collection("conversations").find({$or:[{sender_id : id},{receiver_id : id}]}).sort({conversationLastUpdatedDate: -1}).toArray();
        res.send(userConversation);
    }catch(error){
        console.log("catch - getConversation error",error);
        res.status(500).send(error);
    }
})


//get conversation Id from userDetails

router.get("/getConversationId/:id1/:id2",async function(req,res){
    try{
        const {id1,id2} = req.params;
        const userConversation = await client.db("chatIon").collection("conversations").find({$and: [{$or:[{sender_id: id1},{sender_id: id2}]},{$or:[{receiver_id: id1},{receiver_id: id2}]}]}).toArray();
        res.send(userConversation[0]._id);
    }catch(error){
        console.log("catch - getConversationId error",error);
        res.status(500).send(error);
    }
})



export const conversationRouter = router;


