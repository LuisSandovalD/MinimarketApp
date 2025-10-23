import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import {
  getDocumentTypes,
  createDocumentType,
  updateDocumentType,
  deleteDocumentType,
} from "../../../api/documentType";
import Loading from "../../../components/common/Loading";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function DocumentType() {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    requires_vat: false,
  });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [message, setMessage] = useState(null);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  // Cargar lista
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getDocumentTypes();
      setDocumentTypes(res);
    } catch {
      showMessage("❌ Error al cargar tipos de documentos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Manejadores
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateDocumentType(editing, formData);
        showMessage("✅ Tipo de documento actualizado correctamente");
      } else {
        await createDocumentType(formData);
        showMessage("✅ Tipo de documento creado correctamente");
      }
      setFormData({ name: "", code: "", requires_vat: false });
      setEditing(null);
      setShowForm(false);
      fetchData();
    } catch {
      showMessage("❌ Error al guardar tipo de documento", "error");
    }
  };

  const handleEdit = (doc) => {
    setEditing(doc.id);
    setFormData({
      name: doc.name,
      code: doc.code,
      requires_vat: !!doc.requires_vat,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({ name: "", code: "", requires_vat: false });
    setShowForm(false);
  };

  const confirmDelete = (doc) => {
    setDeleteTarget(doc);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDocumentType(deleteTarget.id);
      showMessage("🗑️ Tipo de documento eliminado");
      fetchData();
    } catch {
      showMessage("❌ Error al eliminar tipo de documento", "error");
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen lg:p-0 pt-16 overflow-hidden">
      <div className="flex-1 ml-0 lg:ml-72 transition-all duration-300 relative">
        <NavBarAdmin />

        {/* Mensaje flotante */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`fixed top-24 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold z-50 ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-6 h-[calc(100vh-70px)] overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-800 rounded-lg">
                  <FileText className="text-white" size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Tipos de Documento
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Gestiona los tipos de documentos del sistema
                  </p>
                </div>
              </div>
              {!showForm && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all shadow-lg"
                >
                  <Plus size={20} />
                  Nuevo Tipo
                </motion.button>
              )}
            </div>
          </div>

          {/* Formulario con animación */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200 max-w-4xl mx-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {editing
                      ? "Editar Tipo de Documento"
                      : "Nuevo Tipo de Documento"}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all"
                        placeholder="Ej: Boleta de Venta"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all uppercase"
                        placeholder="Ej: BOL"
                        maxLength="10"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Configuración
                      </label>
                      <div className="flex items-center h-[42px] bg-gray-50 rounded-lg px-4 border border-gray-200">
                        <input
                          type="checkbox"
                          name="requires_vat"
                          checked={formData.requires_vat}
                          onChange={handleChange}
                          className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-2 focus:ring-gray-300"
                        />
                        <label className="ml-3 text-sm font-medium text-gray-700">
                          Requiere IGV (18%)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all font-medium shadow-sm"
                    >
                      {editing ? "Actualizar" : "Crear"} Tipo
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabla con animación */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden w-90 sm:w-full"
          >
            <div className="relative w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["ID", "Nombre", "Código", "Requiere IGV", "Acciones"].map(
                      (head) => (
                        <th
                          key={head}
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {documentTypes.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="text-gray-300 mb-3" size={48} />
                          <p className="text-gray-500 font-medium">
                            No hay tipos de documentos registrados
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Haz clic en "Nuevo Tipo" para agregar uno
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    documentTypes.map((doc, i) => (
                      <motion.tr
                        key={doc.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`hover:bg-gray-50 transition-colors ${
                          i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-800">
                          #{doc.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          <div className="flex items-center gap-2">
                            <FileText className="text-gray-400" size={18} />
                            {doc.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold uppercase">
                            {doc.code}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {doc.requires_vat ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                              <CheckCircle size={14} />
                              Sí
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              <XCircle size={14} />
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(doc)}
                              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => confirmDelete(doc)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {documentTypes.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Mostrando{" "}
                  <span className="font-semibold text-gray-800">
                    {documentTypes.length}
                  </span>{" "}
                  tipo{documentTypes.length !== 1 ? "s" : ""} de documento
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modal de eliminación */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-[#DC2626]" size={28} />
                <h3 className="text-xl font-semibold text-[#1E293B]">
                  Confirmar eliminación
                </h3>
              </div>
              <p className="text-[#475569] mb-6">
                ¿Estás seguro de que deseas eliminar el tipo{" "}
                <span className="font-medium text-[#1E293B]">
                  {deleteTarget?.name}
                </span>
                ? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#CBD5E1] text-[#334155] hover:bg-[#F1F5F9] transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-all"
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
