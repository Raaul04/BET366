import { useEffect, useState } from "preact/hooks";
import { Apuesta } from "../types.ts";
import VerResultado from "./VerResultado.tsx";

export default function UserApuestas() {
  const [apuestas, setApuestas] = useState<Apuesta[]>([]);
  const [email, setEmail] = useState("");
  const [saldo, setSaldo] = useState<number | null>(null);

  const cargarSaldo = async (correo: string) => {
    try {
      const res = await fetch(`/api/saldo?email=${correo}`);
      const data = await res.json();
      setSaldo(data.bets);
    } catch (err) {
      console.error("Error al cargar saldo:", err);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const user = JSON.parse(stored);
    setEmail(user.email);

    // Cargar apuestas
    fetch(`/api/apuestas?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => setApuestas(data));

    // Cargar saldo
    cargarSaldo(user.email);
  }, []);

  return (
    <div className="user-profile-page">
      <h1>Tus Apuestas</h1>

      {saldo === null ? (
        <p>Cargando saldo...</p>
      ) : (
        <p
          style={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            marginBottom: "1rem",
          }}
        >
          Saldo actual: {saldo.toFixed(2)} bets
        </p>
      )}

      {apuestas.length === 0 && <p>No tienes apuestas todavía.</p>}

      <a
        href="/main"
        className="button"
        style={{ marginBottom: "1rem", display: "inline-block" }}
      >
        Volver al inicio
      </a>

      {apuestas.map((apuesta) => (
        <div
          key={apuesta._id?.toString()}
          className="match-card"
          style="margin-bottom: 1rem;"
        >
          <p>
            <strong>{apuesta.partido.equipoLocal}</strong> vs{" "}
            <strong>{apuesta.partido.equipoVisitante}</strong>
          </p>
          <p>
            Seleccionaste: {apuesta.seleccion} | Cuota: {apuesta.cuota}
          </p>
          <p>Fecha: {new Date(apuesta.fecha).toLocaleString()}</p>
          <p>Apostado: {apuesta.monto} bets</p>

          {apuesta.resuelta ? (
            <p style={{ color: apuesta.acertada ? "green" : "red" }}>
              Resultado: {apuesta.resultado} |{" "}
              {apuesta.acertada
                ? `¡Ganaste! Has recibido ${(
                    apuesta.monto * parseFloat(apuesta.cuota)
                  ).toFixed(2)} bets.`
                : `Perdiste. Se restaron ${apuesta.monto} bets.`}
            </p>
          ) : (
            <VerResultado
              apuesta={apuesta}
              email={email}
              actualizarSaldo={() => cargarSaldo(email)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
