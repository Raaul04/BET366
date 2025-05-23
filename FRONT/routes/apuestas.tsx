// routes/apuestas.tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import ApuestasCollection from "../db/apuestas.ts";

interface Apuesta {
  userEmail: string;
  partido: {
    equipoLocal: string;
    equipoVisitante: string;
    fecha: string;
    hora: string;
    cuotas: { home: string; draw: string; away: string };
  };
  seleccion: string;
  cuota: string;
  fecha: string;
}

export const handler: Handlers = {
  async GET(_req, ctx) {
    const apuestas = await ApuestasCollection.find({}).toArray();
    return ctx.render(apuestas);
  },
};

export default function Apuestas({ data }: PageProps<Apuesta[]>) {
  return (
    <div className="apuestas-page">
      <h1>Historial de Apuestas</h1>
      {data.length === 0 ? (
        <p>No hay apuestas registradas.</p>
      ) : (
        <ul>
          {data.map((apuesta, i) => (
            <li key={i}>
              <strong>{apuesta.partido.equipoLocal} vs {apuesta.partido.equipoVisitante}</strong><br />
              Apuesta: {apuesta.seleccion} (Cuota: {apuesta.cuota})<br />
              Fecha: {new Date(apuesta.fecha).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
