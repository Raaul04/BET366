import { MongoClient, OptionalId } from "npm:mongodb";
import { Partido, UserSaldo } from "../types.ts";



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

export const ApuestasCollection = db.collection<ApuestaDB>("apuestas");
export const UsersCollection = db.collection<UserSaldo>("users");
