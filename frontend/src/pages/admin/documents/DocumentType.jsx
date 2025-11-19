import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import FullscreenButton from "../../../components/common/buttons/FullscreenButton";
import {
  getDocumentTypes,
  createDocumentType,
  updateDocumentType,
  deleteDocumentType,
} from "@/api";
import Loading from "@/components/common/loaders/AppLoading";
import DocumentTypeFormModal from "@/components/modalsForms/DocumentTypeFormModal";
import ConfirmDialog from "@/components/common/modals/ConfirmDialog";

import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  TrendingUp,
  Search,
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
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, doc: null });
  const [search, setSearch] = useState("");
  const [filterVAT, setFilterVAT] = useState("all"); // all, with_vat, without_vat

  // Toast mejorado
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Cargar lista
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getDocumentTypes();
      setDocumentTypes(res || []);
    } catch (error) {
      showToast("Error al cargar tipos de documentos", "error");
      setDocumentTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrado mejorado
  const filteredDocuments = documentTypes.filter((doc) => {
    const matchesSearch = [doc.name, doc.code]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesVAT =
      filterVAT === "all" ||
      (filterVAT === "with_vat" && doc.requires_vat) ||
      (filterVAT === "without_vat" && !doc.requires_vat);

    return matchesSearch && matchesVAT;
  });

  // Manejadores
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value.toUpperCase(),
    }));
  };

  const resetForm = useCallback(() => {
    setFormData({ name: "", code: "", requires_vat: false });
    setEditing(null);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación
    if (!formData.name.trim()) {
      showToast("El nombre es requerido", "error");
      return;
    }

    if (!formData.code.trim()) {
      showToast("El código es requerido", "error");
      return;
    }

    try {
      if (editing) {
        await updateDocumentType(editing, formData);
        showToast("Tipo de documento actualizado correctamente", "success");
      } else {
        await createDocumentType(formData);
        showToast("Tipo de documento creado correctamente", "success");
      }
      resetForm();
      setShowModal(false);
      fetchData();
    } catch (error) {
      const errorMsg = editing
        ? "Error al actualizar tipo de documento"
        : "Error al crear tipo de documento";
      showToast(errorMsg, "error");
    }
  };

  const handleEdit = (doc) => {
    setEditing(doc.id);
    setFormData({
      name: doc.name,
      code: doc.code,
      requires_vat: !!doc.requires_vat,
    });
    setShowModal(true);
  };

  const handleNewDocument = () => {
    resetForm();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const confirmDelete = (doc) => {
    setConfirmModal({ show: true, doc });
  };

  const handleDelete = async () => {
    if (!confirmModal.doc) return;
    try {
      await deleteDocumentType(confirmModal.doc.id);
      showToast("Tipo de documento eliminado correctamente", "success");
      fetchData();
    } catch (error) {
      showToast("Error al eliminar tipo de documento. Puede estar en uso.", "error");
    } finally {
      setConfirmModal({ show: false, doc: null });
    }
  };

  // Estadísticas
  const stats = {
    total: documentTypes.length,
    withVAT: documentTypes.filter((d) => d.requires_vat).length,
    withoutVAT: documentTypes.filter((d) => !d.requires_vat).length,
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 lg:pt-0 pt-16 relative">
      <NavBarAdmin />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 z-50 flex items-center gap-3 bg-white shadow-xl rounded-lg px-5 py-3 border-l-4"
            style={{
              borderLeftColor: toast.type === "success" ? "#10B981" : "#EF4444",
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle className="text-green-500" size={22} />
            ) : (
              <XCircle className="text-red-500" size={22} />
            )}
            <span className="text-sm font-medium text-slate-700">
              {toast.msg}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <DocumentTypeFormModal
        open={showModal}
        onClose={handleCloseModal}
        form={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        editingId={editing}
      />

      <ConfirmDialog
        open={confirmModal.show}
        onClose={() => setConfirmModal({ show: false, doc: null })}
        onConfirm={handleDelete}
        title="Eliminar Tipo de Documento"
        message={`¿Estás seguro de eliminar el tipo de documento "${confirmModal.doc?.name}"? Esta acción no se puede deshacer.`}
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-72 transition-all duration-300">
        {/* Header con estadísticas */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <FileText className="text-slate-600" size={32} />
                Tipos de Documento
              </h1>
              <p className="text-slate-500 mt-1">
                Gestiona los tipos de documentos del sistema
              </p>
            </div>
           <div className="flex justify-between gap-3">
             <button
                onClick={handleNewDocument}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                <Plus size={20} />
                Nuevo Tipo
              </button>
              <FullscreenButton className="shadow" />
           </div>

          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FileText className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Con IGV</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {stats.withVAT}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Sin IGV</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">
                    {stats.withoutVAT}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <XCircle className="text-orange-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Buscador */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full border border-slate-300 rounded-lg bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Filtro de IGV */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterVAT("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterVAT === "all"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterVAT("with_vat")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterVAT === "with_vat"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Con IGV
              </button>
              <button
                onClick={() => setFilterVAT("without_vat")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterVAT === "without_vat"
                    ? "bg-orange-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Sin IGV
              </button>
            </div>
          </div>
        </div>

        {/* Tabla mejorada */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {["ID", "Nombre", "Código", "IGV", "Acciones"].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12">
                      <div className="flex flex-col items-center justify-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                          <FileText className="text-slate-400" size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">
                          No se encontraron tipos de documento
                        </h3>
                        <p className="text-slate-500 mb-6">
                          {search || filterVAT !== "all"
                            ? "Intenta ajustar los filtros de búsqueda"
                            : "Comienza creando tu primer tipo de documento"}
                        </p>
                        {!search && filterVAT === "all" && (
                          <button
                            onClick={handleNewDocument}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium"
                          >
                            <Plus size={18} />
                            Crear Tipo de Documento
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredDocuments.map((doc, i) => (
                      <motion.tr
                        key={doc.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25 }}
                        className="bg-white p-4 rounded-lg shadow-sm"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-slate-900">
                            #{doc.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <FileText className="text-blue-600" size={18} />
                            </div>
                            <span className="text-sm font-medium text-slate-800">
                              {doc.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wide">
                            {doc.code}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {doc.requires_vat ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700">
                              <CheckCircle size={14} />
                              Requiere
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600">
                              <XCircle size={14} />
                              No requiere
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(doc)}
                              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Editar"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => confirmDelete(doc)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>

          {filteredDocuments.length > 0 && (
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Mostrando{" "}
                <span className="font-semibold text-slate-800">
                  {filteredDocuments.length}
                </span>{" "}
                de{" "}
                <span className="font-semibold text-slate-800">
                  {documentTypes.length}
                </span>{" "}
                tipo{documentTypes.length !== 1 ? "s" : ""} de documento
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}