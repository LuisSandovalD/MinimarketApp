import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createCustomer, updateCustomer } from "../../api/customer";
import { X, User, CreditCard, Phone, MapPin, Mail, CheckCircle, Info } from "lucide-react";

export default function ModalCustomer({ isOpen, onClose, customer, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    dni_ruc: "",
    phone: "",
    address: "",
    email: "",
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setForm(
      customer
        ? {
            name: customer.name || "",
            dni_ruc: customer.dni_ruc || "",
            phone: customer.phone || "",
            address: customer.address || "",
            email: customer.email || "",
            active: customer.active ?? true,
          }
        : {
            name: "",
            dni_ruc: "",
            phone: "",
            address: "",
            email: "",
            active: true,
          }
    );
  }, [customer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (customer) {
        await updateCustomer(customer.id, form);
        setMessage({ text: "✅ Cliente actualizado correctamente.", type: "success" });
      } else {
        await createCustomer(form);
        setMessage({ text: "✅ Cliente agregado correctamente.", type: "success" });
      }

      // Esperar 1 segundo, cerrar y recargar lista
      setTimeout(() => {
        onSaved?.();
        onClose();
      }, 1000);
    } catch {
      setMessage({ text: "❌ Error al guardar el cliente.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        className="fixed inset-0 bg-[#1E293B]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E2E8F0] overflow-hidden relative"
        >
          {/* Mensaje flotante */}
          {message && (
            <div
              className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-xl text-sm font-semibold shadow-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Header */}
          <div className="bg-[#F8FAFC] px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl border border-[#E2E8F0]">
                <User className="text-[#64748B]" size={20} />
              </div>
              <h2 className="text-xl font-bold text-[#1E293B]">
                {customer ? "Editar Cliente" : "Nuevo Cliente"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <X className="text-[#64748B]" size={20} />
            </button>
          </div>

          {/* Formulario */}
          <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {[
              {
                label: "Nombre del cliente *",
                icon: User,
                name: "name",
                type: "text",
                placeholder: "Ej: Juan Pérez García",
                required: true,
              },
              {
                label: "DNI",
                icon: CreditCard,
                name: "dni_ruc",
                type: "text",
                placeholder: "Ej: 12345678 o 20481234567",
              },
              {
                label: "Teléfono",
                icon: Phone,
                name: "phone",
                type: "text",
                placeholder: "Ej: 987654321",
              },
              {
                label: "Dirección",
                icon: MapPin,
                name: "address",
                type: "text",
                placeholder: "Ej: Av. Los Olivos 123, Lima",
              },
              {
                label: "Correo electrónico",
                icon: Mail,
                name: "email",
                type: "email",
                placeholder: "cliente@email.com",
              },
            ].map(({ label, icon: Icon, name, type, placeholder, required }) => (
              <div key={name}>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#1E293B] mb-2">
                  <Icon size={16} className="text-[#94A3B8]" />
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required={required}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#CBD5E1] focus:border-[#CBD5E1] outline-none bg-white text-[#1E293B] placeholder-[#94A3B8] transition-all"
                />
              </div>
            ))}

            {/* Estado */}
            <div className="flex items-center gap-3 p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <input
                type="checkbox"
                name="active"
                id="active"
                checked={form.active}
                onChange={handleChange}
                className="w-5 h-5 accent-[#CBD5E1] rounded cursor-pointer"
              />
              <label
                htmlFor="active"
                className="flex items-center gap-2 text-sm font-semibold text-[#1E293B] cursor-pointer"
              >
                <CheckCircle size={16} className="text-[#94A3B8]" />
                Cliente activo
              </label>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] text-[#1E293B] hover:bg-[#F8FAFC] transition-all font-semibold disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !form.name}
                className="flex-1 px-4 py-3 rounded-xl bg-[#CBD5E1] text-[#1E293B] font-semibold hover:bg-[#94A3B8] transition-all shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#1E293B] border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </span>
                ) : customer ? (
                  "Guardar Cambios"
                ) : (
                  "Crear Cliente"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
