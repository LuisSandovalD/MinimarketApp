import { useState, useEffect } from "react";
import api from "../../api/core/axios";
import fondo from "../../assets/img/VerifyEmail/verifyEmail.jpg";

// Componentes comunes
import InputField from "@/components/common/forms/InputField";
import Button from "@/components/common/buttons/Button";
import ErrorMessage from "@/components/common/feedback/ErrorMessage";
import SuccessMessage from "@/components/common/feedback/SuccessMessage";
import {FullscreenButton} from "@/components/common/buttons";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && emailSent) {
      window.open("https://mail.google.com", "_blank");
    }
  }, [countdown, emailSent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.post("/forgot-password", { email });
      setSuccess(res.data.message || "Correo enviado. Revisa tu bandeja de entrada.");
      setEmailSent(true);
      setCountdown(5);
      setEmail("");
    } catch (error) {
      const message =
        error.response?.data?.message || "Error al enviar el correo. Intenta nuevamente.";
      setError(message);
      setEmailSent(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      {/* Capa oscura con blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <FullscreenButton className="absolute top-6 right-6 z-50 text-white" />
      {/* Tarjeta principal */}
      <div className="relative z-10 w-full max-w-md p-10 rounded-3xl border border-white/20 bg-white/15 backdrop-blur-2xl transition-all duration-500 text-white">
        {/* Icono principal */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-5 rounded-2xl shadow-lg">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent mb-3">
          Recuperar Contraseña
        </h2>

        <p className="text-gray-100/90 text-center mb-3 leading-relaxed">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {/* Mensajes de estado */}
        <div className="mb-3">
          <ErrorMessage message={error} />
          <SuccessMessage message={success} />  
        </div>

        {/* Contador visual si el correo fue enviado */}
        {emailSent && countdown > 0 && (
          <div className="flex flex-col items-center mb-6 animate-fade-in">
            <p className="text-sm text-gray-300 mb-2">Redirigiendo a Gmail en:</p>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#4b5563"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#10b981"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - countdown / 5)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-green-400">
                {countdown}
              </span>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            type="email"
            placeholder="luissandoval@minimarket.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading || countdown > 0}
          >
            {loading
              ? "Enviando..."
              : countdown > 0
              ? `Redirigiendo (${countdown}s)`
              : "Enviar enlace de recuperación"}
          </Button>
        </form>

        {/* Enlace al login */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-center text-gray-300 text-sm">
            ¿Recordaste tu contraseña?{" "}
            <a
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition"
            >
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
