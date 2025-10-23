import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  putCategory,
  deleteCategory,
} from "../../../api/category";
import { getUnits } from "../../../api/unit";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Pencil, Trash2, Search, CheckCircle, XCircle } from "lucide-react";
import Loading from "../../../components/common/Loading";

export default function CategoriesCrud() {
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    unit_id: "",
    active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null });

  // --- Cargar categorías y unidades ---
  useEffect(() => {
    fetchCategories();
    fetchUnits();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res || []);
    } catch {
      showToast("Error al cargar categorías", "error");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async () => {
    try {
      const res = await getUnits();
      setUnits(res || []);
    } catch {
      showToast("Error al cargar unidades de medida", "error");
      setUnits([]);
    }
  };

  // --- Función de toast ---
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // --- Filtrado ---
  const filteredCategories = categories.filter((cat) =>
    [cat.name, cat.description, cat.unit?.name]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // --- Formulario ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await putCategory(editingId, form);
        showToast("Categoría actualizada correctamente", "success");
      } else {
        await createCategory(form);
        showToast("Categoría creada correctamente", "success");
      }
      setForm({ name: "", description: "", unit_id: "", active: true });
      setEditingId(null);
      setShowModal(false);
      fetchCategories();
    } catch {
      showToast("Error al guardar categoría", "error");
    }
  };

  const handleEdit = (cat) => {
    setForm({
      name: cat.name,
      description: cat.description,
      unit_id: cat.unit_id,
      active: Boolean(cat.active),
    });
    setEditingId(cat.id);
    setShowModal(true);
  };

  const confirmDelete = (id) => setConfirmModal({ show: true, id });

  const handleDelete = async () => {
    try {
      await deleteCategory(confirmModal.id);
      showToast("Categoría eliminada correctamente", "success");
      fetchCategories();
    } catch {
      showToast("Error al eliminar categoría", "error");
    } finally {
      setConfirmModal({ show: false, id: null });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] lg:pt-0 pt-16 relative">
      <NavBarAdmin />

      {/* Toast de notificación */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-md text-white flex items-center gap-2 ${
              toast.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {toast.type === "error" ? (
              <XCircle size={18} />
            ) : (
              <CheckCircle size={18} />
            )}
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 p-8 ml-0 lg:ml-72 transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#1E293B]">
            Gestión de Categorías
          </h1>
          <button
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", description: "", unit_id: "", active: true });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[#CBD5E1] text-[#1E293B] px-4 py-2 rounded hover:bg-[#E2E8F0] transition"
          >
            <PlusCircle size={18} /> Nueva Categoría
          </button>
        </div>

        {/* Buscador */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-3 top-3 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-[#E2E8F0] rounded-lg bg-white text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#CBD5E1]"
          />
        </div>

        {/* Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((cat) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm hover:shadow-md hover:bg-[#F9F7F3] transition"
              >
                <h2 className="text-lg font-semibold text-[#1E293B]">
                  {cat.name}
                </h2>
                <p className="text-sm text-[#64748B] mb-2">
                  {cat.description}
                </p>
                <p className="text-sm text-[#94A3B8] mb-2">
                  Unidad: {cat.unit?.name || "—"} ({cat.unit?.abbreviation || ""})
                </p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    cat.active
                      ? "bg-[#CBD5E1] text-[#1E293B]"
                      : "bg-[#F1F5F9] text-[#64748B]"
                  }`}
                >
                  {cat.active ? "Activo" : "Inactivo"}
                </span>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-[#1E293B] hover:bg-[#F1F5F9] p-2 rounded transition"
                    title="Editar"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => confirmDelete(cat.id)}
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
            No hay categorías registradas.
          </p>
        )}
      </div>

      {/* MODAL DE FORMULARIO */}
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
                {editingId ? "Editar Categoría" : "Nueva Categoría"}
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
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-[#64748B]">Unidad de Medida</label>
                  <select
                    name="unit_id"
                    value={form.unit_id}
                    onChange={handleChange}
                    className="w-full border border-[#E2E8F0] rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#CBD5E1] bg-white"
                    required
                  >
                    <option value="">Selecciona una unidad</option>
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.abbreviation})
                      </option>
                    ))}
                  </select>
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

      {/* MODAL DE CONFIRMACIÓN */}
      <AnimatePresence>
        {confirmModal.show && (
          <motion.div
            className="fixed inset-0 bg-[#1E293B]/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center"
            >
              <h3 className="text-lg font-semibold text-[#1E293B] mb-3">
                Confirmar eliminación
              </h3>
              <p className="text-sm text-[#64748B] mb-6">
                ¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setConfirmModal({ show: false, id: null })}
                  className="px-4 py-2 rounded bg-[#F1F5F9] text-[#1E293B] hover:bg-[#E2E8F0]"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
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
