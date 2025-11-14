import { motion, AnimatePresence } from "framer-motion";
import { Package, PlusCircle, CheckCircle, XCircle } from "lucide-react";
import NavBarAdmin from "@/components/navbars/NavBarAdmin";
import Loading from "@/components/common/loaders/AppLoading";
import CategoryFormModal from "@/components/modalsForms/CategoryFormModal";
import ConfirmDialog from "@/components/common/modals/ConfirmDialog";
import CategoryFilters from "../../../components/features/categories/components/CategoryFilters";
import CategoryList from "../../../components/features/categories/components/CategoryList";
import useCategories from "../../../components/features/categories/hooks/useCategories";

export default function Categories() {
  const {
    filtered,
    pagination,
    form,
    units,
    loading,
    toast,
    confirmModal,
    showModal,
    search,
    filterStatus,
    editingId,
    categories,
    setForm,
    setShowModal,
    setConfirmModal,
    handleSubmit,
    handleDelete,
    resetForm,
    showToast,
    goToPage,
    changeItemsPerPage,
    setSearch,
    setFilterStatus,
  } = useCategories();

  const stats = {
    total: categories.length,
    active: categories.filter((c) => c.active).length,
    inactive: categories.filter((c) => !c.active).length,
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 lg:pt-0 pt-0 relative">
      <NavBarAdmin />

      {/* Toast */}
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

      {/* Modal de formulario */}
      <CategoryFormModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        form={form}
        units={units}
        onChange={(e) => {
          const { name, value, type, checked } = e.target;
          setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
          }));
        }}
        onSubmit={handleSubmit}
        editingId={editingId}
      />

      {/* Confirmar eliminación */}
      <ConfirmDialog
        open={confirmModal.show}
        onClose={() => setConfirmModal({ show: false, id: null, name: "" })}
        onConfirm={handleDelete}
        title="Eliminar Categoría"
        message={`¿Estás seguro de eliminar la categoría "${confirmModal.name}"? Esta acción no se puede deshacer.`}
      />

      {/* Contenido principal */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-72 transition-all duration-300">
        {/* Header + estadísticas */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                  Categorías
                </h2>
                <p className="text-slate-500 mt-1">
                  Administra las categorías de productos
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              <PlusCircle size={20} />
              Nueva Categoría
            </button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Package className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Activas</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Inactivas</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">{stats.inactive}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <XCircle className="text-orange-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <CategoryFilters
          search={search}
          setSearch={setSearch}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {/* Listado */}
        <CategoryList
          items={filtered.slice(
            (pagination.currentPage - 1) * pagination.itemsPerPage,
            pagination.currentPage * pagination.itemsPerPage
          )}
          pagination={pagination}
          goToPage={goToPage}
          changeItemsPerPage={changeItemsPerPage}
          getPageNumbers={() => {
            const { currentPage, totalPages } = pagination;
            const pages = [];
            const maxVisible = 5;
            if (totalPages <= maxVisible) {
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              const start = Math.max(1, currentPage - 2);
              const end = Math.min(totalPages, currentPage + 2);
              if (start > 1) pages.push(1, "...");
              for (let i = start; i <= end; i++) pages.push(i);
              if (end < totalPages) pages.push("...", totalPages);
            }
            return pages;
          }}
          onEdit={(cat) => {
            setForm({
              name: cat.name,
              description: cat.description || "",
              unit_id: cat.unit_id,
              active: Boolean(cat.active),
            });
            setShowModal(true);
          }}
          onDelete={(id) => {
            const cat = categories.find((c) => c.id === id);
            setConfirmModal({ show: true, id, name: cat?.name || "" });
          }}
          onCreate={() => {
            resetForm();
            setShowModal(true);
          }}
          search={search}
          filterStatus={filterStatus}
        />
      </div>
    </div>
  );
}
