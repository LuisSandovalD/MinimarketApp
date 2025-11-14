import { motion, AnimatePresence } from "framer-motion";
import { Package, PlusCircle } from "lucide-react";
import CategoryCard from "./CategoryCard";
import Pagination from "@/components/common/Pagination";

export default function CategoryList({
  items,
  pagination,
  goToPage,
  changeItemsPerPage,
  getPageNumbers,
  onEdit,
  onDelete,
  onCreate,
  search,
  filterStatus,
}) {
  return (
    <>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {items.map((cat) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <CategoryCard cat={cat} onEdit={onEdit} onDelete={onDelete} />
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
            <Package className="text-slate-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No se encontraron categorías
          </h3>
          <p className="text-slate-500 mb-6">
            {search || filterStatus !== "all"
              ? "Intenta ajustar los filtros de búsqueda"
              : "Comienza creando tu primera categoría"}
          </p>
          {!search && filterStatus === "all" && (
            <button
              onClick={onCreate}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium"
            >
              <PlusCircle size={18} />
              Crear Categoría
            </button>
          )}
        </motion.div>
      )}

      <Pagination
        pagination={pagination}
        goToPage={goToPage}
        changeItemsPerPage={changeItemsPerPage}
        getPageNumbers={getPageNumbers}
      />
    </>
  );
}
