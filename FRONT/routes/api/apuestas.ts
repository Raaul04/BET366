import { ApuestasCollection } from "../../db/db.ts";

export const handler = async (req: Request): Promise<Response> => {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return new Response("Email requerido", { status: 400 });
  }

  const apuestas = await ApuestasCollection.find({ email }).toArray();
  return new Response(JSON.stringify(apuestas), {
    headers: { "Content-Type": "application/json" },
  });
};