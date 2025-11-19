import { useState, useEffect } from "react";
import { register } from "@/api";
import { updateUser } from "@/api";

export default function UserFormModal({ isOpen, onClose, user, onUserSaved }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [is_active, setIsActive] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEdit = !!user;

  useEffect(() => {
    if (isEdit) {
      setName(user.name);
      setEmail(user.email);
      setPassword("");
      setPasswordConfirmation("");
      setIsActive(user.is_active);
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
      setIsActive(true);
    }
    setMessage(null);
    setIsError(false);
  }, [user, isEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);
    setLoading(true);

    try {
      if (!isEdit) {
        if (password !== passwordConfirmation) {
          setMessage("Las contraseñas no coinciden.");
          setIsError(true);
          setLoading(false);
          return;
        }

        const newRole = "cajero";

        await register({
          name,
          email,
          is_active: true,
          password,
          password_confirmation: passwordConfirmation,
          role: newRole,
        });

        setMessage("✅ Cajero registrado correctamente.");
      } else {
        await updateUser(user.id, {
          name,
          email,
        });

        setMessage("✅ Usuario actualizado correctamente.");
      }

      setTimeout(() => {
        onUserSaved();
        onClose();
      }, 1500);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "❌ Error al guardar el usuario. Intente de nuevo.";
      setMessage(message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-[#FFFFFF] rounded-xl shadow-2xl p-6 w-full max-w-lg relative border border-[#E2E8F0]">
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl text-[#94A3B8] hover:text-[#64748B] transition duration-200"
        >
          ×
        </button>

        <h3 className="text-xl font-bold text-[#1E293B] mb-6 pb-2 border-b border-[#E2E8F0]">
          {isEdit ? "Editar Usuario" : "Agregar Nuevo Cajero"}
        </h3>

        {/* Mensaje visual */}
        {message && (
          <p
            className={`p-3 rounded-lg mb-4 text-sm font-medium border ${
              isError
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-green-50 border-green-200 text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#64748B] mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#E2E8F0] p-3 rounded-lg text-[#1E293B] focus:border-[#94A3B8] focus:ring focus:ring-[#CBD5E1] focus:ring-opacity-50 transition duration-200"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#64748B] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#E2E8F0] p-3 rounded-lg text-[#1E293B] focus:border-[#94A3B8] focus:ring focus:ring-[#CBD5E1] focus:ring-opacity-50 transition duration-200"
              required
            />
          </div>

          {!isEdit && (
            <div className="mb-4 text-sm text-[#64748B] bg-[#F1F5F9] p-3 rounded-lg border border-[#E2E8F0]">
              **Rol asignado automáticamente:** Cajero
            </div>
          )}

          {!isEdit && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#64748B] mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#E2E8F0] p-3 rounded-lg text-[#1E293B] focus:border-[#94A3B8] focus:ring focus:ring-[#CBD5E1] focus:ring-opacity-50 transition duration-200"
                  required
                />
              </div>

              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#64748B] mb-1">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) =>
                    setPasswordConfirmation(e.target.value)
                  }
                  className="w-full border border-[#E2E8F0] p-3 rounded-lg text-[#1E293B] focus:border-[#94A3B8] focus:ring focus:ring-[#CBD5E1] focus:ring-opacity-50 transition duration-200"
                  required
                />
              </div>

              {/* Estado */}
            
            </>
          )}

          <div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#64748B] mb-1">
                    Estado </label>
                  <select
                    value={is_active ? "activo" : "inactivo"}
                    onChange={(e) => setIsActive(e.target.value === "activo")}
                    className="w-full border border-[#E2E8F0] p-3 rounded-lg text-[#1E293B] focus:border-[#94A3B8] focus:ring focus:ring-[#CBD5E1] focus:ring-opacity-50 transition duration-200"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
                </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-[#1E293B] font-bold py-3 rounded-lg shadow-md transition duration-300 ${
              loading
                ? "bg-[#CBD5E1] cursor-not-allowed opacity-80"
                : "bg-[#CBD5E1] hover:bg-[#94A3B8] active:bg-[#64748B]"
            }`}
          >
            {loading
              ? "Guardando..."
              : isEdit
              ? "Actualizar Usuario"
              : "Guardar Cajero"}
          </button>
        </form>
      </div>
    </div>
  );
}
