import { useState, useEffect } from "preact/hooks";

export default function SaldoForm() {
  const [cantidad, setCantidad] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [saldo, setSaldo] = useState(0);  // Estado para saldo actual

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const { id, bets } = JSON.parse(user);
      setUserId(id);
      setSaldo(bets ?? 0); // Asumimos que en user viene el saldo "bets"
    }
  }, []);

  const manejarOperacion = async (tipo: "ingreso" | "retiro") => {
    if (!userId) {
      setMensaje("Usuario no autenticado.");
      return;
    }

    if (tipo === "retiro" && cantidad > saldo) {
      setMensaje("❌ No puedes retirar más de tu saldo actual.");
      return;
    }

    if (cantidad <= 0) {
      setMensaje("❌ La cantidad debe ser mayor que 0.");
      return;
    }

    const res = await fetch("/api/saldo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, cantidad, userId }),
    });

    const data = await res.json();

    if (res.ok) {
      setSaldo(data.saldo);  // Actualiza saldo con la respuesta del backend
      setMensaje(`✅ Operación exitosa. Nuevo saldo: ${data.saldo} Bets`);
    } else {
      setMensaje(`❌ Error: ${data.error}`);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2em" }}>
      <input
        type="number"
        min="0"
        value={cantidad}
        onInput={(e) =>
          setCantidad(parseFloat((e.target as HTMLInputElement).value))
        }
      />
      <div style={{ marginTop: "1em" }}>
        <button onClick={() => manejarOperacion("ingreso")}>➕ Ingresar Bets</button>
        <button onClick={() => manejarOperacion("retiro")} style={{ marginLeft: "1em" }}>
          ➖ Retirar Bets
        </button>
      </div>
      <p style={{ marginTop: "1em" }}>{mensaje}</p>
    </div>
  );
}
