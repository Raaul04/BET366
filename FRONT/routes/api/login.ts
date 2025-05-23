import { Handlers } from "$fresh/server.ts";
import UsersCollection from "../../db/User.ts";
export const handler: Handlers = {
  async POST(req) {
    const { email } = await req.json();

    if (!email) {
      return new Response("Email es requerido", { status: 400 });
    }

    const user = await UsersCollection.findOne({ email });

    if (!user) {
      return new Response("Usuario no encontrado", { status: 404 });
    }

    const { _id, name, age } = user;

    return new Response(
      JSON.stringify({ id: _id?.toString(), name, email, age, bets: 1000 }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  },
};
