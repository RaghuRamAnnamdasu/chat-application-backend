import express from "express";
import { client } from "../index.js";
import { ObjectId } from "bson";

const router = express.Router();

router.get("/:id/:searchWord/getSearchResults",async function(req,res){
    try{
        // console.log(req.query, req.params);
        const {id,searchWord} = req.params;
        console.log(ObjectId(id));
        // const {searchWord} = req.query;
        const searchResults = await client.db("chatIon").collection("users").aggregate([{$match: {$or: [{userName: {$regex:searchWord,$options:"i"}},{email: {$regex:searchWord,$options:"i"}}]}},{$match: {_id:{$ne : ObjectId(id)}}}]).toArray();
        console.log(searchWord,searchResults);
        res.send(searchResults);
    }catch(error){
        console.log("catch - Search error",error);
        res.status(500).send(error);
    }
})


export const searchRouter = router;