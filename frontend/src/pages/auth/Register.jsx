import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../api/auth"; 
import { Mail, Lock, ArrowRight, User, Sparkles } from "lucide-react";

// Suponemos que la ruta de la imagen de fondo es correcta
import fondo from "../../assets/img/Home/login.jpg"; 

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
      // 💡 Nota: En una aplicación real, probablemente aquí se usaría un rol
      // como "Cliente" o se dejaría que el backend asigne el rol predeterminado.
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      // Registro exitoso, redirigir al login
      navigate("/"); 
    } catch (err) {
      console.error(err);
      // Asume que el error de la API viene en err.response.data.message si usas Axios
      const apiError = err.response?.data?.message || "Ocurrió un error al intentar registrarse.";
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
      {/* Overlay oscuro y blur de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50 backdrop-blur-[2px]"></div>

      {/* Elementos de fondo animados */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Contenedor principal del formulario */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in-up">
        {/* Tarjeta de registro transparente con blur */}
        <div className="backdrop-blur-2xl bg-white/10 shadow-2xl rounded-3xl p-10 border border-white/20 relative overflow-hidden">
          
          <div className="relative flex flex-col items-center mb-10">
            {/* Ícono de Perfil */}
            <div className="relative mb-6">
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                <User className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
            </div>
            
            {/* Título y subtítulo */}
            <h2 className="text-4xl font-extralight text-white tracking-wide mb-2">
              Crear Cuenta
            </h2>
            
            <p className="text-sm text-white/70 font-light flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Únete a nuestra plataforma
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative">
            
            {/* Campo Nombre */}
            <div className="relative group">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 group-focus-within:text-white transition-colors duration-300" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 focus:bg-white/15 transition-all duration-300 text-white placeholder-white/50"
                required
                style={{ fontFamily: 'Segoe UI, -apple-system, sans-serif' }}
              />
            </div>
            
            {/* Campo Correo */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 group-focus-within:text-white transition-colors duration-300" strokeWidth={1.5} />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 focus:bg-white/15 transition-all duration-300 text-white placeholder-white/50"
                required
                style={{ fontFamily: 'Segoe UI, -apple-system, sans-serif' }}
              />
            </div>
            
            {/* Campo Contraseña */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 group-focus-within:text-white transition-colors duration-300" strokeWidth={1.5} />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 focus:bg-white/15 transition-all duration-300 text-white placeholder-white/50"
                required
                style={{ fontFamily: 'Segoe UI, -apple-system, sans-serif' }}
              />
            </div>
            
            {/* Campo Confirmar Contraseña */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 group-focus-within:text-white transition-colors duration-300" strokeWidth={1.5} />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 focus:bg-white/15 transition-all duration-300 text-white placeholder-white/50"
                required
                style={{ fontFamily: 'Segoe UI, -apple-system, sans-serif' }}
              />
            </div>

            {/* Botón de Registro */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full overflow-hidden group mt-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl transition-all duration-300 group-hover:scale-105"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-2 py-4 text-white font-light">
                <span>{isLoading ? "Registrando..." : "Registrarse"}</span>
                {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={1.5} />}
              </div>
            </button>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-md border border-red-400/30 text-white px-4 py-3 rounded-xl text-sm text-center font-light animate-shake shadow-lg">
                {error}
              </div>
            )}
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

        <div className="text-center mt-8">
          <p className="text-xs text-white/60 font-light tracking-wider uppercase flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            Protegido y seguro
          </p>
        </div>
      </div>

      <style>{`
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
}