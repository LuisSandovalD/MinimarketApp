// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { getUser } from "../api/auth";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/"; // Si no hay token, redirige al login
      return;
    }

    // Obtener datos del usuario autenticado
    getUser(token)
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  }, []);

  if (!user) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Bienvenido, {user.name}</h2>
      <p>Email: {user.email}</p>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
