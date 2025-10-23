import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/auth";
import { Mail, Lock, KeyRound, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import fondo from "../../assets/img/Home/login.jpg";

const ResetPassword = () => {
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

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      token: token || "",
      email: emailFromUrl || "",
    }));
  }, [token, emailFromUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await resetPassword(form);
      setMessage(res.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      const apiError =
        error.response?.data?.message ||
        "Error al restablecer la contraseña. Inténtalo de nuevo.";
      setMessage(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in-up">
        <div className="backdrop-blur-2xl bg-white/10 shadow-2xl rounded-3xl p-10 border border-white/20 relative overflow-hidden">
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <div className="relative w-24 h-24 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                <KeyRound className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="text-3xl font-light text-white tracking-wide mb-2">
              Restablecer Contraseña
            </h2>
            <p className="text-sm text-white/70 font-light text-center">
              Estás restableciendo la contraseña para{" "}
              <span className="text-cyan-300 font-medium">{form.email}</span>
            </p>
          </div>

          {message && (
            <div
              className={`p-4 mb-5 rounded-xl text-sm text-center font-medium shadow-lg animate-fade-in ${
                message.includes("Error") || message.includes("no coinciden")
                  ? "bg-red-500/20 border border-red-400/40 text-red-300 animate-shake"
                  : "bg-emerald-500/20 border border-emerald-400/40 text-emerald-300"
              } flex items-center justify-center gap-2 backdrop-blur-md`}
            >
              {message.includes("Error") || message.includes("no coinciden") ? (
                <XCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white/70 text-sm placeholder-white/50"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-300/70 group-focus-within:text-cyan-200 transition-colors duration-300" />
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-cyan-500/30 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-white/50 transition-all duration-300"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-300/70 group-focus-within:text-cyan-200 transition-colors duration-300" />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={form.password_confirmation}
                onChange={(e) =>
                  setForm({ ...form, password_confirmation: e.target.value })
                }
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-cyan-500/30 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-white/50 transition-all duration-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden group mt-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-xl transition-all duration-300 group-hover:scale-105"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-2 py-4 text-white font-light">
                <span>{loading ? "Procesando..." : "Cambiar contraseña"}</span>
                {!loading && (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-white/70 font-light">
              ¿Recordaste tu contraseña?{" "}
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                }}
                className="text-cyan-300 font-medium hover:underline"
              >
                Inicia sesión
              </a>
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-white/60 font-light tracking-wider uppercase flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            Restablecimiento seguro
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
