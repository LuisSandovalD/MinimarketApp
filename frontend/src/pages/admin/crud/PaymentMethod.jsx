import { useEffect, useState } from "react";
import {
  getPayment,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../../../api/paymentMethod";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Loading from "../../../components/common/Loading";

export default function PaymentMethodCrud() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", active: true });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Estados para eliminar
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const res = await getPayment();
      setPaymentMethods(res || []);
    } catch {
      setMessage({ type: "error", text: "Error al cargar métodos de pago." });
    } finally {
      setLoading(false);
    }
  };

  const filteredMethods = paymentMethods.filter((m) =>
    [m.name, m.description].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updatePaymentMethod(editingId, form);
        setMessage({ type: "success", text: "Método de pago actualizado correctamente." });
      } else {
        await createPaymentMethod(form);
        setMessage({ type: "success", text: "Método de pago creado correctamente." });
      }
      setForm({ name: "", description: "", active: true });
      setEditingId(null);
      setShowModal(false);
      fetchPaymentMethods();
    } catch {
      setMessage({ type: "error", text: "Ocurrió un error al guardar los datos." });
    }
  };

  const handleEdit = (method) => {
    setForm({
      name: method.name,
      description: method.description,
      active: Boolean(method.active),
    });
    setEditingId(method.id);
    setShowModal(true);
  };

  // Confirmar eliminación (abrir modal)
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Ejecutar eliminación
  const handleDelete = async () => {
    try {
      await deletePaymentMethod(deleteId);
      fetchPaymentMethods();
      setMessage({ type: "success", text: "Método de pago eliminado correctamente." });
    } catch {
      setMessage({ type: "error", text: "No se pudo eliminar el método de pago." });
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  // Desaparecer notificación automáticamente
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] lg:pt-0 pt-16">
      <NavBarAdmin />

      {/* Notificación flotante */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-md flex items-center gap-2 text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 p-8 ml-0 lg:ml-72 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#1E293B]">
            Gestión de Métodos de Pago
          </h1>
          <button
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", description: "", active: true });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[#CBD5E1] text-[#1E293B] px-4 py-2 rounded hover:bg-[#E2E8F0] transition"
          >
            <PlusCircle size={18} /> Nuevo Método
          </button>
        </div>

        {/* Buscador */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-3 top-3 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Buscar método de pago..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-[#E2E8F0] rounded-lg bg-white text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#CBD5E1]"
          />
        </div>

        {/* Lista */}
        {filteredMethods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMethods.map((method) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm hover:shadow-md hover:bg-[#F9F7F3] transition"
              >
                <h2 className="text-lg font-semibold text-[#1E293B]">{method.name}</h2>
                <p className="text-sm text-[#64748B] mb-2">
                  {method.description || "Sin descripción"}
                </p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    method.active
                      ? "bg-[#CBD5E1] text-[#1E293B]"
                      : "bg-[#F1F5F9] text-[#64748B]"
                  }`}
                >
                  {method.active ? "Activo" : "Inactivo"}
                </span>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(method)}
                    className="text-[#1E293B] hover:bg-[#F1F5F9] p-2 rounded transition"
                    title="Editar"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => confirmDelete(method.id)}
                    className="text-red-500 hover:bg-[#F1F5F9] p-2 rounded transition"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[#64748B] mt-10">
            No hay métodos de pago registrados.
          </p>
        )}
      </div>

      {/* MODAL CREAR / EDITAR */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-[#1E293B]/30 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 border border-[#E2E8F0]"
            >
              <h2 className="text-xl font-semibold mb-4 text-[#1E293B]">
                {editingId ? "Editar Método" : "Nuevo Método"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-[#64748B]">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-[#E2E8F0] rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#CBD5E1]"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-[#64748B]">Descripción</label>
                  <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border border-[#E2E8F0] rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#CBD5E1]"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-[#64748B]">
                  <input
                    type="checkbox"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                  />
                  Activo
                </label>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded bg-[#F1F5F9] text-[#1E293B] hover:bg-[#E2E8F0]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#CBD5E1] text-[#1E293B] hover:bg-[#E2E8F0]"
                  >
                    {editingId ? "Actualizar" : "Guardar"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL ELIMINAR */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-[#1E293B]/30 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 border border-[#E2E8F0] text-center"
            >
              <h3 className="text-lg font-semibold text-[#1E293B] mb-3">
                Confirmar eliminación
              </h3>
              <p className="text-sm text-[#64748B] mb-6">
                ¿Estás seguro de que deseas eliminar este método de pago? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded bg-[#F1F5F9] text-[#1E293B] hover:bg-[#E2E8F0] transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
