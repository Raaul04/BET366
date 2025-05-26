import { ObjectId } from "npm:mongodb";
import { ApuestasCollection, UsersCollection } from "../../db/db.ts";

export const handler = async (req: Request): Promise<Response> => {
  const { apuestaId, resultado, acertada, cambio, email } = await req.json();


  const apuestaActualizada = await ApuestasCollection.updateOne(
    { _id: new ObjectId(apuestaId), resuelta: { $ne: true } }, 
    { $set: { resultado, acertada, resuelta: true } }
  );

  if (apuestaActualizada.modifiedCount === 1) {
    await UsersCollection.updateOne(
      { email },
      { $inc: { bets: Number(cambio) } }  // 👈 blindado
    );

  }
  const user = await UsersCollection.findOne({ email });
  console.log("Nuevo saldo bets:", user?.bets);


  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
