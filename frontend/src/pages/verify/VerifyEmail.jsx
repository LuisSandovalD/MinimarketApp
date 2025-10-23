// src/pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function VerifyEmail() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const token = localStorage.getItem("token");
        await api.post(
          "/email/verification-notification",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessage("Correo de verificación enviado. Revisa tu bandeja.");
      } catch {
        setMessage("Error al enviar verificación.");
      }
    };

    verify();
  }, []);

  return (
    <div>
      <h2>Verificar tu correo electrónico</h2>
      <p>{message}</p>
    </div>
  );
}
