import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function SalesEmptyState({ hasFilters, onClearFilters }) {
  if (hasFilters) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20 bg-white rounded-xl border border-gray-200"
      >
        <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg font-semibold mb-2">No se encontraron resultados</p>
        <p className="text-gray-500 text-sm mb-4">
          Intenta ajustar los filtros o términos de búsqueda
        </p>
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
        >
          Limpiar filtros
        </button>
      </motion.div>
    );
  }

  return null;
}