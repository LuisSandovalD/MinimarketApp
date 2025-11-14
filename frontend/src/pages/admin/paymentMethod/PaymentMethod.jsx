import { useEffect, useState, useCallback } from "react";
import {
  getPayment,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "@/api";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  CreditCard,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Loading from "@/components/common/loaders/AppLoading";
import PaymentMethodFormModal from "../../../components/modalsForms/PaymentFormModal";
import ConfirmDialog from "../../../components/common/modals/ConfirmDialog";

export default function PaymentMethodCrud() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", active: true });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null, name: "" });
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const res = await getPayment();
      setPaymentMethods(res || []);
    } catch (error) {
      showToast("Error al cargar métodos de pago", "error");
      setPaymentMethods([]);
    } finally {
      setLoading(false);
    }
  };

  // Toast mejorado
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Filtrado mejorado
  const filteredMethods = paymentMethods.filter((m) => {
    const matchesSearch = [m.name, m.description]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && m.active) ||
      (filterStatus === "inactive" && !m.active);

    return matchesSearch && matchesStatus;
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const resetForm = useCallback(() => {
    setForm({ name: "", description: "", active: true });
    setEditingId(null);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación
    if (!form.name.trim()) {
      showToast("El nombre es requerido", "error");
      return;
    }

    try {
      if (editingId) {
        await updatePaymentMethod(editingId, form);
        showToast("Método de pago actualizado correctamente", "success");
      } else {
        await createPaymentMethod(form);
        showToast("Método de pago creado correctamente", "success");
      }
      resetForm();
      setShowModal(false);
      fetchPaymentMethods();
    } catch (error) {
      const errorMsg = editingId
        ? "Error al actualizar método de pago"
        : "Error al crear método de pago";
      showToast(errorMsg, "error");
    }
  };

  const handleEdit = (method) => {
    setForm({
      name: method.name,
      description: method.description || "",
      active: Boolean(method.active),
    });
    setEditingId(method.id);
    setShowModal(true);
  };

  const handleNewMethod = () => {
    resetForm();
    setShowModal(true);
  };

  const confirmDelete = (method) => {
    setConfirmModal({
      show: true,
      id: method.id,
      name: method.name,
    });
  };

  const handleDelete = async () => {
    try {
      await deletePaymentMethod(confirmModal.id);
      showToast("Método de pago eliminado correctamente", "success");
      fetchPaymentMethods();
    } catch (error) {
      showToast("Error al eliminar método de pago. Puede estar en uso.", "error");
    } finally {
      setConfirmModal({ show: false, id: null, name: "" });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Estadísticas
  const stats = {
    total: paymentMethods.length,
    active: paymentMethods.filter((m) => m.active).length,
    inactive: paymentMethods.filter((m) => !m.active).length,
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

      <PaymentMethodFormModal
        open={showModal}
        onClose={handleCloseModal}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        editingId={editingId}
      />

      <ConfirmDialog
        open={confirmModal.show}
        onClose={() => setConfirmModal({ show: false, id: null, name: "" })}
        onConfirm={handleDelete}
        title="Eliminar Método de Pago"
        message={`¿Estás seguro de eliminar el método de pago "${confirmModal.name}"? Esta acción no se puede deshacer.`}
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-72 transition-all duration-300">
        {/* Header con estadísticas */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <Wallet className="text-slate-600" size={32} />
                Métodos de Pago
              </h1>
              <p className="text-slate-500 mt-1">
                Administra los métodos de pago del sistema
              </p>
            </div>
            <button
              onClick={handleNewMethod}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              <PlusCircle size={20} />
              Nuevo Método
            </button>
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
                  <CreditCard className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Activos</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {stats.active}
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
                  <p className="text-sm text-slate-500 font-medium">Inactivos</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">
                    {stats.inactive}
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
                placeholder="Buscar por nombre o descripción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full border border-slate-300 rounded-lg bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Filtro de estado */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === "all"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterStatus("active")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === "active"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => setFilterStatus("inactive")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === "inactive"
                    ? "bg-orange-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Inactivos
              </button>
            </div>
          </div>
        </div>

        {/* Grid de métodos de pago */}
        {filteredMethods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredMethods.map((method) => (
                <motion.div
                  key={method.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-200 group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <CreditCard className="text-blue-600" size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {method.name}
                      </h3>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${
                        method.active
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          method.active ? "bg-green-500" : "bg-orange-500"
                        }`}
                      />
                      {method.active ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                    {method.description || "Sin descripción"}
                  </p>

                  <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleEdit(method)}
                      className="flex-1 flex items-center justify-center gap-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm"
                      title="Editar método"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => confirmDelete(method)}
                      className="flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm"
                      title="Eliminar método"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <Wallet className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No se encontraron métodos de pago
            </h3>
            <p className="text-slate-500 mb-6">
              {search || filterStatus !== "all"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza creando tu primer método de pago"}
            </p>
            {!search && filterStatus === "all" && (
              <button
                onClick={handleNewMethod}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium"
              >
                <PlusCircle size={18} />
                Crear Método de Pago
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}