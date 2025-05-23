// /routes/apuesta.tsx (solo server, no hooks)
import { Handlers, PageProps } from "$fresh/server.ts";
import IslaApuesta from "../islands/IslaApuesta.tsx";

interface DatosApuesta {
  equipoLocal: string;
  equipoVisitante: string;
  fecha: string;
  hora: string;
  seleccion: string;
  cuota: string;
}

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const data: DatosApuesta = {
      equipoLocal: url.searchParams.get("local") ?? "",
      equipoVisitante: url.searchParams.get("visitante") ?? "",
      fecha: url.searchParams.get("fecha") ?? "",
      hora: url.searchParams.get("hora") ?? "",
      seleccion: url.searchParams.get("seleccion") ?? "",
      cuota: url.searchParams.get("cuota") ?? "",
    };
    return ctx.render(data);
  },
};

export default function Apuesta({ data }: PageProps<DatosApuesta>) {
  return (
    <div>
      <h1>Apuesta en curso</h1>
      <p>
        <strong>{data.equipoLocal} vs {data.equipoVisitante}</strong><br />
        Fecha: {data.fecha} - {data.hora}<br />
        Selección: <strong>{data.seleccion}</strong><br />
        Cuota: <strong>{data.cuota}</strong>
      </p>

      {/* Aquí renderizamos el island que maneja el email y la apuesta */}
      <IslaApuesta
        equipoLocal={data.equipoLocal}
        equipoVisitante={data.equipoVisitante}
        fecha={data.fecha}
        hora={data.hora}
        seleccion={data.seleccion}
        cuota={data.cuota}
      />
    </div>
  );
}
