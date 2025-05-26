import { useEffect, useState } from "preact/hooks";

export default function UserIcon({ mostrarDetalles = false }: { mostrarDetalles?: boolean }) {
  const [usuario, setUsuario] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      try {
        const user = JSON.parse(data);
        if (user?.email) {
          setUsuario(user);
        }
      } catch (e) {
        console.error("Error al leer usuario del localStorage", e);
      }
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    window.location.href = "/login"; 
  };

  if (!usuario) {
    return (
      <div className="user-info">
        <a href="/login">Iniciar sesión</a>
      </div>
    );
  }

  if (mostrarDetalles) {
    return (
      <div className="user-profile-page">
        <h1>👤 Perfil del Usuario</h1>
        <p><strong>Email:</strong> {usuario.email}</p>
        <button onClick={cerrarSesion} className="logout-btn">
          Cerrar sesión
        </button>
        <br />
        <a href="/" className="back-home">  Volver al inicio  </a>
        <br/>
        <a href="/main"  className="back-home">Volver a apostar</a>

      </div>
    );
  }

  return (
    <div className="user-info">
      <a href="/usuario" title="Ver perfil" className="user-link">
        👤 <span>{usuario.email}</span>
      </a>
    </div>
  );
}