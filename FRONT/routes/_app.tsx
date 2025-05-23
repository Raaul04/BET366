import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>FRONT</title>

        {/* Estilos principales */}
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/main.css" />
      </head>

      <body>
        <Component />
      </body>
    </html>
  );
}
