import { useState } from "react";
import { login, checkEmail } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, User, ChevronLeft, Sparkles } from "lucide-react";
import fondo from "../../assets/img/Home/login.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    
    try {
      const res = await login({ email, password });
      localStorage.setItem("token", res.access_token);
      navigate("/dashboard");
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
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
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
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50 backdrop-blur-[2px]"></div>

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in-up">
        <div className="backdrop-blur-2xl bg-white/10 shadow-2xl rounded-3xl p-10 border border-white/20 relative overflow-hidden">
          
          <div className="relative flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                <User className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
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

          <div className="space-y-5 relative">
            {step === 1 ? (
              <>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 group-focus-within:text-white transition-colors duration-300" strokeWidth={1.5} />
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleEmailSubmit)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 focus:bg-white/15 transition-all duration-300 text-white placeholder-white/50"
                    style={{ fontFamily: 'Segoe UI, -apple-system, sans-serif' }}
                    autoFocus
                  />
                </div>

                <button
                  type="button"
                  onClick={handleEmailSubmit}
                  disabled={isLoading}
                  className="relative w-full overflow-hidden group bg-blue-900 rounded-xl"
                >

                  <div className="relative flex items-center justify-center space-x-2 py-4 text-white font-light">
                    <span>{isLoading ? "Verificando..." : "Siguiente"}</span>
                    {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={1.5} />}
                  </div>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-200 mb-4 group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" strokeWidth={1.5} />
                  <span className="text-sm font-light">Cambiar cuenta</span>
                </button>

                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 group-focus-within:text-white transition-colors duration-300" strokeWidth={1.5} />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handlePasswordSubmit)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 focus:bg-white/15 transition-all duration-300 text-white placeholder-white/50"
                    style={{ fontFamily: 'Segoe UI, -apple-system, sans-serif' }}
                    autoFocus
                  />
                </div>

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-white/80 hover:text-white font-light transition-colors duration-200 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={handlePasswordSubmit}
                  disabled={isLoading}
                  className="relative w-full overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl transition-all duration-300 group-hover:scale-105"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2 py-4 text-white font-light">
                    <span>{isLoading ? "Iniciando sesión..." : "Iniciar sesión"}</span>
                    {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={1.5} />}
                  </div>
                </button>
              </>
            )}

            {error && (
              <div className="bg-red-500/20 backdrop-blur-md border border-red-400/30 text-white px-4 py-3 rounded-xl text-sm text-center font-light animate-shake shadow-lg">
                {error}
              </div>
            )}
          </div>

          {step === 1 && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-white/70 font-light">
                ¿No tienes cuenta?{" "}
                <Link 
                  to="/register" 
                  className="text-white font-medium hover:underline transition-all duration-200"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          )}
        </div>

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