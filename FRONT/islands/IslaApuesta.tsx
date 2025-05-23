// /islands/IslaApuesta.tsx (componente cliente)
import { useState, useEffect } from "preact/hooks";

interface Props {
  equipoLocal: string;
  equipoVisitante: string;
  fecha: string;
  hora: string;
  seleccion: string;
  cuota: string;
}

export default function IslaApuesta(props: Props) {
  const [monto, setMonto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Leer email desde localStorage solo en cliente
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.email) setEmail(user.email);
      } catch {
        setEmail("");
      }
    }
  }, []);

  if (!email) {
    return <p>Por favor inicia sesión para realizar apuestas.</p>;
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    const payload = {
      userEmail: email,
      partido: {
        equipoLocal: props.equipoLocal,
        equipoVisitante: props.equipoVisitante,
        fecha: props.fecha,
        hora: props.hora,
        cuotas: {
          [props.seleccion]: props.cuota,
        },
      },
      seleccion: props.seleccion,
      cuota: props.cuota,
      monto: Number(monto),
      fecha: new Date().toISOString(),
    };

    const response = await fetch("/api/apostar", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (response.ok) {
      setMensaje("¡Apuesta realizada con éxito!");
      setMonto("");
    } else {
      setMensaje("Error al realizar la apuesta: " + (data.error || response.statusText));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        ¿Cuánto deseas apostar?
        <input
          type="number"
          min="1"
          required
          value={monto}
          onInput={(e) => setMonto(e.currentTarget.value)}
        />
      </label>
      <button type="submit">Confirmar Apuesta</button>

      {mensaje && <p>{mensaje}</p>}
    </form>
  );
}
