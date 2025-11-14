import { FileText } from "lucide-react";

export const ShoppingDetailSummary = ({ stats, filteredCount, totalCount }) => {
  return (
    <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-6 mt-6 text-white shadow-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-slate-200 text-sm mb-1 font-medium">Resumen General</p>
            <p className="text-xs text-slate-300">
              Mostrando {filteredCount} de {totalCount} registros
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="text-center">
            <p className="text-slate-300 text-sm mb-1">Total Items</p>
            <p className="text-2xl font-bold">{stats.totalItems}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-300 text-sm mb-1">Valor Total</p>
            <p className="text-2xl font-bold">S/ {stats.totalValue}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-300 text-sm mb-1">Promedio</p>
            <p className="text-2xl font-bold">S/ {stats.averagePrice}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShoppingDetailSummary;