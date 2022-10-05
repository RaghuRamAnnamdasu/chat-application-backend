import { client } from "../index.js";

export async function getUserByName(email) {
    return await client.db("chatIon").collection("users").findOne({email : email});
  }

export async function createUSer(data) {
return await client.db("chatIon").collection("users").insertOne(data);
}