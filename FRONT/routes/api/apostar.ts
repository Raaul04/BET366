import { Handlers } from "$fresh/server.ts";
import { ApuestasCollection, UsersCollection } from "../../db/db.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const { userEmail, partido, seleccion, cuota, monto, fecha } = await req.json();

      if (!userEmail || typeof userEmail !== "string") {
        console.warn("❌ Email inválido recibido:", userEmail);
        return new Response(JSON.stringify({ error: "Email inválido" }), { status: 400 });
      }

      const usuario = await UsersCollection.findOne({ email: userEmail });

      if (!usuario) {
        return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404 });
      }

      // ✅ Validar que tenga saldo suficiente antes de restar
      if ((usuario.bets ?? 0) < monto) {
        return new Response(JSON.stringify({ error: "Saldo insuficiente" }), { status: 403 });
      }

      const nuevoSaldo = (usuario.bets ?? 0) - monto;

      // Actualizar saldo
      await UsersCollection.updateOne(
        { email: userEmail },
        { $set: { bets: nuevoSaldo } }
      );

      // Guardar apuesta
      await ApuestasCollection.insertOne({
        userId: usuario._id.toString(),
        email: userEmail,
        partido,
        seleccion,
        cuota,
        monto,
        fecha: new Date(fecha),
      });

      console.log("✅ Apuesta registrada correctamente");

      return new Response(
        JSON.stringify({ message: "Apuesta registrada", saldo: nuevoSaldo }),
        { status: 200 }
      );
    } catch (error) {
      console.error("🔥 Error en /api/apostar:", error);
      return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
    }
  },
};
