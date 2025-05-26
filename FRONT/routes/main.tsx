import "https://deno.land/std@0.216.0/dotenv/load.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import UserIcon from "../islands/UserIcon.tsx";
import UserApuestas from "../islands/UserApuestas.tsx";

// Función para generar cuotas aleatorias
function generateRandomOdds(): { home: string; away: string; draw: string } {
  return {
    home: (Math.random() * (2.0 - 1.2) + 1.2).toFixed(2),  
    away: (Math.random() * (5.0 - 1.8) + 1.8).toFixed(2),  
    draw: (Math.random() * (4.0 - 2.0) + 2.0).toFixed(2),  
  };
}

// Estructura de cada partido
interface Partido {
  equipoLocal: string;
  equipoVisitante: string;
  fecha: string;
  hora: string;
  cuotas: {
    home: string;
    draw: string;
    away: string;
  };
}

export const handler: Handlers = {
  async GET(_, ctx) {
    const SEASON = "2022";
    const LEAGUE_ID = "140"; // LaLiga
    const FROM_DATE = "2023-04-21";
    const TO_DATE = "2023-04-25";

    const res = await fetch(
      `https://v3.football.api-sports.io/fixtures?season=${SEASON}&league=${LEAGUE_ID}&from=${FROM_DATE}&to=${TO_DATE}`,
      {
        headers: {
          "x-apisports-key": Deno.env.get("API_FOOTBALL_KEY") ?? "",
        },
      }
    );

    const json = await res.json();

    const partidos: Partido[] = json.response.map((fixture: any) => {
      const fechaObj = new Date(fixture.fixture.date);
      const fecha = fechaObj.toLocaleDateString("es-ES", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });
      const hora = fechaObj.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        equipoLocal: fixture.teams.home.name,
        equipoVisitante: fixture.teams.away.name,
        fecha,
        hora,
        cuotas: generateRandomOdds(),
      };
    });

    return ctx.render(partidos);
  },
};

export default function Main({ data }: PageProps<Partido[]>) {
  const porFecha: Record<string, Partido[]> = {};

  data.forEach((p) => {
    if (!porFecha[p.fecha]) porFecha[p.fecha] = [];
    porFecha[p.fecha].push(p);
  });

  return (
    <div className="page matches">
      <h1 className="selector">Partidos de la Jornada</h1>
      <div className="navbar">
        <a href="/" className="logo">
          ⚽ Bet366
        </a>
        <div className="right-items">
          <UserIcon />
          <a href="/saldo" className="saldo-link">💰 Gestión de Saldo</a>
        </div>
        <div>
          <a href="/visualizar-apuestas" className="button_apuesta"> Ver Apuestas</a>
        </div>
      </div>

      {Object.entries(porFecha).map(([fecha, partidos]) => (
        <div key={fecha}>
          <div className="date-title">{fecha}</div>
          {partidos.map((partido, index) => (
            <div className="match-card" key={index}>
              <div className="match-info">
                <span className="team-name">
                  {partido.equipoLocal} vs {partido.equipoVisitante}
                </span>
                <span className="match-time">{partido.hora}</span>
              </div>
              <div className="odds">
                Home
                <a
                  href={`/apuesta?local=${encodeURIComponent(
                    partido.equipoLocal
                  )}&visitante=${encodeURIComponent(
                    partido.equipoVisitante
                  )}&fecha=${encodeURIComponent(
                    partido.fecha
                  )}&hora=${encodeURIComponent(
                    partido.hora
                  )}&seleccion=home&cuota=${partido.cuotas.home}`}
                >
                  <button type="button">{partido.cuotas.home}</button>
                </a>
                Draw
                <a
                  href={`/apuesta?local=${encodeURIComponent(
                    partido.equipoLocal
                  )}&visitante=${encodeURIComponent(
                    partido.equipoVisitante
                  )}&fecha=${encodeURIComponent(
                    partido.fecha
                  )}&hora=${encodeURIComponent(
                    partido.hora
                  )}&seleccion=draw&cuota=${partido.cuotas.draw}`}
                >
                  <button type="button">{partido.cuotas.draw}</button>
                </a>
                Away
                <a
                  href={`/apuesta?local=${encodeURIComponent(
                    partido.equipoLocal
                  )}&visitante=${encodeURIComponent(
                    partido.equipoVisitante
                  )}&fecha=${encodeURIComponent(
                    partido.fecha
                  )}&hora=${encodeURIComponent(
                    partido.hora
                  )}&seleccion=away&cuota=${partido.cuotas.away}`}
                >
                  <button type="button">{partido.cuotas.away}</button>
                </a>
              </div>
            </div>
          ))}
        </div>
      ))}

      <footer className="footer">
        <p>Ingeniería del Software</p>
      </footer>
    </div>
  );
}
