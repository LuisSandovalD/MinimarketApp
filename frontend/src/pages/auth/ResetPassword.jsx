import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "@/api";
import fondo from "../../assets/img/NewPassword/newpassword.jpg";
import { Mail, Lock, ArrowRight, KeyRound } from "lucide-react";

// Componentes comunes
import Button from "@/components/common/buttons/Button";
import InputField from "@/components/common/forms/InputField";
import ErrorMessage from "@/components/common/feedback/ErrorMessage";
import SuccessMessage from "@/components/common/feedback/SuccessMessage";
import {FullscreenButton} from "@/components/common/buttons";


export default function ResetPassword() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    token: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      token: token || "",
      email: emailFromUrl || "",
    }));
  }, [token, emailFromUrl]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && success) {
      navigate("/login");
    }
  }, [countdown, success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await resetPassword(form);
      setSuccess(res.message || "¡Contraseña restablecida correctamente!");
      setCountdown(5);
    } catch (error) {
      const apiError =
        error.response?.data?.message ||
        "Error al restablecer la contraseña. Inténtalo nuevamente.";
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      {/* Fondo oscuro */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <FullscreenButton className="absolute top-6 right-6 z-50 text-white" />

      {/* Contenedor principal */}
      <div className="relative z-10 w-[90%] max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-8 text-white">
        {/* Icono principal */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-500 p-4 rounded-2xl shadow-lg">
            <KeyRound className="w-10 h-10 text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
          Restablecer Contraseña
        </h2>

        <p className="text-center text-gray-300 mb-3">
          Restableciendo contraseña para{" "}
          <span className="font-semibold text-blue-300">{form.email}</span>
        </p>

        {/* Mensajes de estado */}
        <div className="mb-3">
          <ErrorMessage message={error} />
          <SuccessMessage message={success} />  
        </div>

        {/* Contador visual si hay éxito */}
        {success && countdown > 0 && (
          <div className="flex flex-col items-center mb-6 animate-fade-in">
            <p className="text-sm text-gray-300 mb-1">
              Redirigiendo en {countdown}s
            </p>
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#10b981"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - countdown / 5)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-emerald-300">
                {countdown}
              </span>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            type="email"
            value={form.email}
            icon={Mail}
            disabled
            readOnly
          />

          <InputField
            type="password"
            placeholder="Nueva contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            icon={Lock}
            required
          />

          <InputField
            type="password"
            placeholder="Confirmar contraseña"
            value={form.password_confirmation}
            onChange={(e) =>
              setForm({ ...form, password_confirmation: e.target.value })
            }
            icon={Lock}
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading || countdown > 0}
          >
            {loading
              ? "Procesando..."
              : countdown > 0
              ? `Redirigiendo (${countdown}s)`
              : (
                <span className="flex items-center justify-center gap-2">
                  Cambiar contraseña <ArrowRight className="w-4 h-4" />
                </span>
              )}
          </Button>
        </form>

        {/* Enlace al login */}
        <div className="mt-8 pt-5 border-t border-white/20 text-center">
          <p className="text-gray-400 text-sm">
            ¿Recordaste tu contraseña?{" "}
            <a
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold underline-offset-2 hover:underline"
            >
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
