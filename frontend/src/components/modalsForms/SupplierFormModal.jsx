import { useState, useEffect } from "react";
import {
  X,
  Building2,
  Hash,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { createSupplier, updateSupplier } from "@/api";

export default function SupplierFormModal({ supplier, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    ruc: "",
    phone: "",
    email: "",
    address: "",
    active: true,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (supplier) {
      setForm({
        name: supplier.name || "",
        ruc: supplier.ruc || "",
        phone: supplier.phone || "",
        email: supplier.email || "",
        address: supplier.address || "",
        active: supplier.active ?? true,
      });
    } else {
      setForm({
        name: "",
        ruc: "",
        phone: "",
        email: "",
        address: "",
        active: true,
      });
    }
    setErrors({});
    setMessage(null);
    setIsError(false);
  }, [supplier]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "El nombre es requerido";

    if (!form.ruc.trim()) {
      newErrors.ruc = "El RUC es requerido";
    } else if (form.ruc.length !== 11) {
      newErrors.ruc = "El RUC debe tener 11 dígitos";
    } else if (!/^\d+$/.test(form.ruc)) {
      newErrors.ruc = "El RUC solo debe contener números";
    }

    if (form.phone && !/^\d{9}$/.test(form.phone))
      newErrors.phone = "El teléfono debe tener 9 dígitos";

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Ingrese un correo válido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);
    setIsError(false);

    try {
      if (supplier) {
        await updateSupplier(supplier.id, form);
        setMessage("✅ Proveedor actualizado correctamente.");
      } else {
        await createSupplier(form);
        setMessage("✅ Proveedor agregado correctamente.");
      }

      setTimeout(() => {
        onSaved?.();
        onClose();
      }, 1500);
    } catch {
      setMessage("❌ Error al guardar el proveedor. Intente nuevamente.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building2 className="text-gray-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {supplier ? "Editar Proveedor" : "Nuevo Proveedor"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mensaje visual */}
        {message && (
          <div
            className={`mx-6 mt-4 p-3 rounded-lg border text-sm font-medium ${
              isError
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-green-50 border-green-200 text-green-600"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Nombre Corporativo <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Building2
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ej: Distribuidora ABC S.A.C."
                    className={`w-full border ${
                      errors.name ? "border-red-300" : "border-gray-200"
                    } rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>
                )}
              </div>

              {/* RUC */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  RUC <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Hash
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="ruc"
                    value={form.ruc}
                    onChange={handleChange}
                    maxLength={11}
                    placeholder="20123456789"
                    className={`w-full border ${
                      errors.ruc ? "border-red-300" : "border-gray-200"
                    } rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.ruc && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.ruc}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={9}
                    placeholder="987654321"
                    className={`w-full border ${
                      errors.phone ? "border-red-300" : "border-gray-200"
                    } rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Información de Contacto
            </h3>
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="contacto@empresa.com"
                    className={`w-full border ${
                      errors.email ? "border-red-300" : "border-gray-200"
                    } rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
                )}
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Dirección
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Av. Principal 123, Lima"
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-2 focus:ring-gray-300"
              />
              <label htmlFor="active" className="ml-3 flex items-center gap-2">
                <CheckCircle2
                  className={form.active ? "text-green-600" : "text-gray-400"}
                  size={18}
                />
                <span className="text-sm font-medium text-gray-700">
                  Proveedor activo
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-500 ml-7 mt-1">
              Los proveedores inactivos no aparecerán en las listas de selección
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all font-medium flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Guardando...
              </>
            ) : supplier ? (
              "Guardar Cambios"
            ) : (
              "Agregar Proveedor"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
