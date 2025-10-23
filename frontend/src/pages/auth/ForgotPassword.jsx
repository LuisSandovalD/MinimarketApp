import { useState } from "react";
import api from "../../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/forgot-password", { email });
      setMessage(res.data.message || "Correo enviado. Revisa tu bandeja de entrada 📬");
    } catch (error) {
      setMessage("❌ Error al enviar el correo. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Recuperar Contraseña
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Ingresa tu correo electrónico para recibir un enlace de restablecimiento.
        </p>

        {message && (
          <div
            className={`p-3 rounded text-center mb-4 ${
              message.includes("Error") || message.includes("❌")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-sky-900 text-white py-2.5 rounded-lg transition ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-sky-800 focus:ring-2 focus:ring-sky-300"
            }`}
          >
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          ¿Recordaste tu contraseña?{" "}
          <a href="/" className="text-sky-800 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
