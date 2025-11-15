import { motion, AnimatePresence } from "framer-motion";
import { Package, PlusCircle, CheckCircle, XCircle } from "lucide-react";
import NavBarAdmin from "@/components/navbars/NavBarAdmin";
import Loading from "@/components/common/loaders/AppLoading";
import CategoryFormModal from "@/components/modalsForms/CategoryFormModal";
import ConfirmDialog from "@/components/common/modals/ConfirmDialog";
import CategoryFilters from "../../../components/features/categories/components/CategoryFilters";
import CategoryList from "../../../components/features/categories/components/CategoryList";
import useCategories from "../../../components/features/categories/hooks/useCategories";
import CategoryHeader from "../../../components/features/categories/components/CategoryHeader";
import CategoryStatus from "../../../components/features/categories/components/CategoryStatus";
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

         <CategoryHeader
            resetForm={resetForm}
            setShowModal={setShowModal}
          />
          <CategoryStatus 
            stats = {stats}
          />
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
