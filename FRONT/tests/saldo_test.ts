
import { assertEquals } from "$std/assert/assert_equals.ts";
import { procesarSaldo } from "../lib/procesarSaldo.ts";

Deno.test("Ingreso válido suma al saldo", () => {
  const resultado = procesarSaldo("ingreso", 100, 500);
  assertEquals(resultado.success, true);
  assertEquals(resultado.nuevoSaldo, 600);
});

Deno.test("Retiro válido resta al saldo", () => {
  const resultado = procesarSaldo("retiro", 100, 500);
  assertEquals(resultado.success, true);
  assertEquals(resultado.nuevoSaldo, 400);
});

Deno.test("Retiro mayor que saldo falla", () => {
  const resultado = procesarSaldo("retiro", 600, 500);
  assertEquals(resultado.success, false);
  assertEquals(resultado.error, "Saldo insuficiente");
});

Deno.test("Ingreso con cantidad inválida falla", () => {
  const resultado = procesarSaldo("ingreso", -100, 500);
  assertEquals(resultado.success, false);
  assertEquals(resultado.error, "Cantidad inválida");
});