import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Ruler, PlusCircle } from "lucide-react";

export default function UnitList({ units, onEdit, onDelete, onCreate, searchTerm }) {
  if (units.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
          <Ruler className="text-slate-400" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          No se encontraron unidades
        </h3>
        <p className="text-slate-500 mb-6">
          {searchTerm
            ? "Intenta ajustar tu búsqueda"
            : "Comienza creando tu primera unidad de medida"}
        </p>
        {!searchTerm && (
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium"
          >
            <PlusCircle size={18} />
            Crear Unidad
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence mode="popLayout">
        {units.map((unit, index) => (
          <motion.div
            key={unit.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-1">
                  {unit.name}
                </h3>
                <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg">
                  <Ruler size={14} className="text-slate-500" />
                  <span className="text-sm font-semibold text-slate-700">
                    {unit.abbreviation}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => onEdit(unit)}
                className="flex-1 flex items-center justify-center gap-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm"
              >
                <Edit size={16} />
                Editar
              </button>
              <button
                onClick={() => onDelete(unit)}
                className="flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm"
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
