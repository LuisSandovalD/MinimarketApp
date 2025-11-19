import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, User, ChevronLeft, Sparkles } from "lucide-react";
import fondo from "../../assets/img/Login/login.jpg";
import { login, checkEmail } from "@/api";

// Componentes comunes
import UserAvatar from "@/components/common/UserAvatar";
import Button from "@/components/common/buttons/Button";
import InputField from "@/components/common/forms/InputField";
import ErrorMessage from "@/components/common/feedback/ErrorMessage";
import SuccessMessage from "@/components/common/feedback/SuccessMessage";
import {FullscreenButton} from "@/components/common/buttons";



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    if (!email) {
      setError("Por favor ingresa tu correo");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await checkEmail(email);
      setStep(2);
    } catch {
      setError("Correo no encontrado");
    } finally {
      setIsLoading(false);
    }
  };

 const handlePasswordSubmit = async () => {
  setIsLoading(true);
  setError("");
  setSuccess("");

  try {
    const res = await login({ email, password });
    localStorage.setItem("token", res.access_token);
    setSuccess("Inicio de sesión exitoso. Redirigiendo...");
    setTimeout(() => navigate("/dashboard"), 1500);
  } catch {
    setError("Contraseña incorrecta");
  } finally {
    setIsLoading(false);
  }
};


  const handleBack = () => {
    setStep(1);
    setPassword("");
    setError("");
    setSuccess("");
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") action();
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Capa oscura */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50 backdrop-blur-[2px]"></div>

      <FullscreenButton className="absolute top-6 right-6 z-50 text-white" />

      {/* Efectos visuales */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in-up">
        <div className="backdrop-blur-2xl bg-white/10 shadow-2xl rounded-3xl p-10 border border-white/20 relative overflow-hidden">
          {/* Encabezado */}
          <div className="relative flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <UserAvatar size="md" icon={User} gradient="from-blue-500 to-indigo-600" />
            </div>

            <h2 className="text-4xl font-extralight text-white tracking-wide mb-2">
              {step === 1 ? "Bienvenido" : "Contraseña"}
            </h2>

            {step === 1 && (
              <p className="text-sm text-white/70 font-light flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Inicia sesión para continuar
              </p>
            )}
            {step === 2 && (
              <div className="text-center mt-2">
                <p className="text-sm text-white/90 font-medium px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                  {email}
                </p>
              </div>
            )}
          </div>

          {/* Formulario */}
          <div className="space-y-5 relative">
            {step === 1 ? (
              <>
                <InputField
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleEmailSubmit)}
                  icon={Mail}
                  autoFocus
                />

                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleEmailSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Verificando..." : (
                    <span className="flex items-center justify-center gap-2">
                      Siguiente <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-200 mb-4 group"
                >
                  <ChevronLeft
                    className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm font-light">Cambiar cuenta</span>
                </button>

                <InputField
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handlePasswordSubmit)}
                  icon={Lock}
                  autoFocus
                />

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-white/80 hover:text-white font-light transition-colors duration-200 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={handlePasswordSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Iniciando sesión..." : (
                    <span className="flex items-center justify-center gap-2">
                      Iniciar sesión <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </>
            )}

            {/* Mensajes */}
            <ErrorMessage message={error} />
            <SuccessMessage message={success} />
          </div>
        </div>

        {/* Pie de seguridad */}
        <div className="text-center mt-8">
          <p className="text-xs text-white/60 font-light tracking-wider uppercase flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            Protegido y seguro
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
