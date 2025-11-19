import { TrendingUp } from "lucide-react";

export const GroupSummary = ({ items, groupTotal, groupItems }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-5 mt-4">
      <div className="flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-2.5 rounded-lg">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-sm text-emerald-50 mb-1 font-medium">Resumen de la compra</p>
            <p className="text-xs text-emerald-100">
              {items.length} productos • {groupItems.toFixed(2)} unidades totales
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-emerald-50 mb-1">Total Compra</p>
          <p className="text-2xl font-bold">S/ {groupTotal.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};
export default GroupSummary;
