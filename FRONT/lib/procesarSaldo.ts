export function procesarSaldo(
  tipo: "ingreso" | "retiro",
  cantidad: number,
  saldoActual: number,
): { success: boolean; nuevoSaldo?: number; error?: string } {
  if (isNaN(cantidad) || cantidad <= 0) {
    return { success: false, error: "Cantidad inválida" };
  }

  if (tipo === "retiro") {
    if (saldoActual < cantidad) {
      return { success: false, error: "Saldo insuficiente" };
    }
    return { success: true, nuevoSaldo: saldoActual - cantidad };
  }

  if (tipo === "ingreso") {
    return { success: true, nuevoSaldo: saldoActual + cantidad };
  }

  return { success: false, error: "Tipo de operación inválido" };
}