import { FileText, X } from "lucide-react";

export const ShoppingDetailEmpty = ({ hasFilters, onClearFilters }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
      <div className="bg-gradient-to-br from-slate-100 to-slate-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
        <FileText className="text-slate-400" size={48} />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-2">No hay detalles registrados</h3>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        {hasFilters
          ? "No se encontraron resultados con los filtros aplicados"
          : "Aún no hay detalles de compras en el sistema"}
      </p>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-8 py-3 rounded-xl transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <X size={20} />
          Limpiar filtros
        </button>
      )}
    </div>
  );
};
export default ShoppingDetailEmpty;

