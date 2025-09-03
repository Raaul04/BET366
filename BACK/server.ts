import { Application, Context } from "https://deno.land/x/oak/mod.ts";



const app = new Application();

// Función para generar cuotas aleatorias entre 1.5 y 5.0
function generateRandomOdds(): { home: string; away: string; draw: string } {
  return {
    home: (Math.random() * (2.0 - 1.2) + 1.2).toFixed(2),  
    away: (Math.random() * (5.0 - 1.8) + 1.8).toFixed(2),  
    draw: (Math.random() * (4.0 - 2.0) + 2.0).toFixed(2),  
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