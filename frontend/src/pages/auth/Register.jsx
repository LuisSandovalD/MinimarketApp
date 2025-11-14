import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "@/api";
import { Mail, Lock, ArrowRight, User, Sparkles } from "lucide-react";
import fondo from "../../assets/img/Register/register.jpg";

// Componentes comunes
import UserAvatar from "@/components/common/UserAvatar";
import Button from "@/components/common/buttons/Button";
import InputField from "@/components/common/forms/InputField";
import ErrorMessage from "@/components/common/feedback/ErrorMessage";
import SuccessMessage from "@/components/common/feedback/SuccessMessage";
import {FullscreenButton} from "@/components/common/buttons";


export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess("Registro exitoso. Redirigiendo al inicio de sesión...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      const apiError =
        err.response?.data?.message ||
        "Ocurrió un error al intentar registrarse.";
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
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
      {/* Overlay y fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50 backdrop-blur-[2px]"></div>

      <FullscreenButton className="absolute top-6 right-6 z-50 text-white" />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Contenedor del formulario */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in-up">
        <div className="backdrop-blur-2xl bg-white/10 shadow-2xl rounded-3xl p-10 border border-white/20 relative overflow-hidden">
          {/* Encabezado */}
          <div className="relative flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <UserAvatar size="md" icon={User} gradient="from-blue-500 to-indigo-600" />
            </div>

            <h2 className="text-4xl font-extralight text-white tracking-wide mb-2">
              Crear Cuenta
            </h2>
            <p className="text-sm text-white/70 font-light flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Únete a nuestra plataforma
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5 relative">
            <InputField
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
              required
            />

            <InputField
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <InputField
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            <InputField
              type="password"
              placeholder="Confirmar contraseña"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              icon={Lock}
              required
            />

            <Button
              variant="primary"
              fullWidth
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : (
                <span className="flex items-center justify-center gap-2">
                  Registrarse <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            {/* Mensajes */}
            <ErrorMessage message={error} />
            <SuccessMessage message={success} />
          </form>

          {/* Enlace a Login */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-white/70 font-light">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/"
                className="text-white font-medium hover:underline transition-all duration-200"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Pie inferior */}
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
      `}</style>
    </div>
  );
}
