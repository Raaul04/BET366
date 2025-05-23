import { MongoClient } from "npm:mongodb";
import { UserSaldo } from "../types.ts";

const url = Deno.env.get("MONGO_URL");
if (!url) throw new Error("MONGO_URL not set");

const client = new MongoClient(url);
await client.connect();

const db = client.db("usuarios");
const UsersCollection = db.collection<UserSaldo>("users");

export default UsersCollection;
