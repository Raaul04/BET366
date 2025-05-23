// /routes/saldo.tsx
import SaldoForm from "../islands/SaldoForm.tsx";

export default function PaginaSaldo() {
  return (
    <div className="page matches">
      <h1 className="selector">💰 Gestión de Saldo</h1>
      <SaldoForm />
    </div>
  );
}
