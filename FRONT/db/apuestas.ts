import { MongoClient, OptionalId } from "npm:mongodb";
import { Partido } from "../types.ts";

const url = Deno.env.get("MONGO_URL");
if (!url) throw new Error("MONGO_URL not set");

const client = new MongoClient(url);
await client.connect();

type ApuestaDB = OptionalId<{
  userId: string;
  email?: string; 
  partido: Partido;
  seleccion: string;
  cuota: string;
  monto: number;
  fecha: Date;
}>;

const db = client.db("usuarios");
const ApuestasCollection = db.collection<ApuestaDB>("apuestas");

export default ApuestasCollection;
