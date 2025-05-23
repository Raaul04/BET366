import { FunctionComponent } from "preact";

const HomeSelector: FunctionComponent = () => {
  return (
    <div class="selector">
      <h1>Bienvenido a Bet366</h1>
      <div style={{ display: "flex", gap: "1rem" }}>
        <a href="/register">
          <button class="btn">Registrarse</button>
        </a>
        <a href="/login">
          <button class="btn">Iniciar Sesión</button>
        </a>
      </div>
    </div>
  );
};

export default HomeSelector;
