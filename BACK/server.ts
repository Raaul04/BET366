import { Application, Context } from "https://deno.land/x/oak/mod.ts";

// Reemplaza con tu API Key de API-FOOTBALL
const API_KEY = "83cfc25867a7236127ff4f5b1ba10ffa";  
const LEAGUE_ID = 140; // 140 = Serie A (Italia) - Cambiar según la liga
const SEASON = 2023; // Temporada 2023
const FROM_DATE = "2023-01-01"; // Fecha de inicio de la temporada
const TO_DATE = "2023-12-31"; // Fecha de fin de la temporada

// URL de la API de API-Football para obtener los partidos
const API_URL = `https://v3.football.api-sports.io/fixtures?season=${SEASON}&league=${LEAGUE_ID}&from=${FROM_DATE}&to=${TO_DATE}`;

const app = new Application();

// Función para generar cuotas aleatorias entre 1.5 y 5.0
function generateRandomOdds(): { home: string, away: string, draw: string } {
  return {
    home: (Math.random() * (5.0 - 1.5) + 1.5).toFixed(2),
    away: (Math.random() * (5.0 - 1.5) + 1.5).toFixed(2),
    draw: (Math.random() * (5.0 - 1.5) + 1.5).toFixed(2)
  };
}

app.use(async (context: Context) => {
  if (context.request.url.pathname === "/api/fixtures" && context.request.method === "GET") {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "x-apisports-key": API_KEY, // API Key en los headers
        },
      });

      if (!response.ok) {
        context.response.status = 500;
        context.response.body = { message: "Error al obtener los datos desde la API" };
        console.error("Error al obtener los datos desde la API:", response.statusText);
        return;
      }

      const data = await response.json();

      // Verifica si la respuesta tiene partidos
      if (!data.response || data.response.length === 0) {
        context.response.status = 404;
        context.response.body = { message: "No se encontraron partidos para la temporada 2023." };
        console.warn("No se encontraron partidos para los parámetros dados.");
        return;
      }

      // Si hay partidos, agregar cuotas aleatorias a cada partido
      const fixturesWithOdds = data.response.map((fixture: any) => {
        const odds = generateRandomOdds();
        return {
          id: fixture.fixture.id,
          date: fixture.fixture.date,
          status: fixture.fixture.status.long,
          home: fixture.teams.home.name,
          away: fixture.teams.away.name,
          odds: odds // Cuotas aleatorias generadas
        };
      });

      // Devolver los partidos con las cuotas aleatorias
      context.response.status = 200;
      context.response.body = fixturesWithOdds;
    } catch (error) {
      context.response.status = 500;
      context.response.body = { message: "Error al procesar la solicitud" };
      console.error("Error al procesar la solicitud:", error);
    }
  }
});

// Inicia el servidor en el puerto 8000
console.log("🚀 Servidor REST corriendo en http://localhost:8000");
await app.listen({port:8000});