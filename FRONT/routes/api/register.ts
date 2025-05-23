import { Handlers } from "$fresh/server.ts";
import UsersCollection from "../../db/User.ts";

export const handler: Handlers = {
  async POST(req) {
    const formData = await req.formData();

    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const ageStr = formData.get("age")?.toString();

    if (!name || !email || !ageStr) {
      return new Response("Missing fields", { status: 400 });
    }

    const age = parseInt(ageStr);
    if (isNaN(age) || age < 18) {
      return new Response("Invalid age", { status: 400 });
    }

    try {
      const existingUser = await UsersCollection.findOne({ email });
      if (existingUser) {
        return new Response("Email ya registrado", { status: 409 }); 
      }

      const user = {
        name,
        email,
        age,
        bets: 1000,
      };

      const inserted = await UsersCollection.insertOne(user);
      return new Response(JSON.stringify({ id: inserted }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    } catch (err) {
      console.error("Error al insertar en Mongo:", err);
      return new Response("Database error", { status: 500 });
    }
  },
};
