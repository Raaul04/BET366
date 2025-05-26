import { useState } from "preact/hooks";
import { Apuesta } from "../types.ts";

interface Props {
  apuesta: Apuesta;
  email: string;
}

export default function VerResultado({ apuesta, email }: Props) {
  const [resuelta, setResuelta] = useState(apuesta.resuelta ?? false);
  const [mensaje, setMensaje] = useState("");

  const resolver = async () => {
    if (resuelta || apuesta.resuelta) return;

    // Simular resultado real aleatorio
    const opciones = ["home", "draw", "away"];
    const resultado = opciones[Math.floor(Math.random() * 3)];
    const acertada = resultado === apuesta.seleccion;
    const cambio = acertada
      ? apuesta.monto * parseFloat(apuesta.cuota)
      : -apuesta.monto;

    const res = await fetch("/api/resolver-apuesta", {
      method: "POST",
      body: JSON.stringify({
        apuestaId: apuesta._id?.toString(),
        resultado,
        acertada,
        cambio,
        email,
      }),
    });

    if (res.ok) {
      // ✅ Bloquea clics futuros
      setResuelta(true);
      apuesta.resuelta = true;

      setMensaje(
        acertada
          ? `¡Ganaste! Has recibido ${cambio.toFixed(2)} bets.`
          : `Perdiste. Se restaron ${apuesta.monto} bets.`
      );
    } else {
      setMensaje("Hubo un error al resolver la apuesta.");
    }
  };

  return (
    <div>
      {resuelta ? (
        <p style={{ color: mensaje.includes("Ganaste") ? "green" : "red" }}>
          {mensaje}
        </p>
      ) : (
        <button onClick={resolver}>Ver resultado</button>
      )}
    </div>
  );
}
