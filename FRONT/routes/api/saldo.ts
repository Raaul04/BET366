import { Handlers } from "$fresh/server.ts";
import UsersCollection from "../../db/User.ts";
import { ObjectId } from "npm:mongodb"; // ✅

export const handler: Handlers = {
  async POST(req) {
    const { tipo, cantidad, userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "No autenticado" }), {
        status: 401,
      });
    }

    if (isNaN(cantidad) || cantidad <= 0) {
      return new Response(JSON.stringify({ error: "Cantidad inválida" }), {
        status: 400,
      });
    }

    const user = await UsersCollection.findOne({ _id: new ObjectId(userId) }); // ✅

    if (!user) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), {
        status: 404,
      });
    }

    let nuevoSaldo = user.bets;

    if (tipo === "ingreso") {
      nuevoSaldo += cantidad;
    } else if (tipo === "retiro") {
      if (nuevoSaldo < cantidad) {
        return new Response(JSON.stringify({ error: "Saldo insuficiente" }), {
          status: 400,
        });
      }
      nuevoSaldo -= cantidad;
    }

    await UsersCollection.updateOne(
      { _id: new ObjectId(userId) }, // ✅
      { $set: { bets: nuevoSaldo } },
    );

    return new Response(JSON.stringify({ saldo: nuevoSaldo }), {
      status: 200,
    });
  },
};
