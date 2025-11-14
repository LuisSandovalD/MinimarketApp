import { Package } from "lucide-react";

export const GroupItem = ({ detail }) => {
  return (
    <div className="bg-white rounded-lg p-5 border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-3 rounded-lg border border-sky-200">
            <Package className="text-sky-600" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {detail.product?.name || "N/A"}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-600">
                Código: {detail.product?.code || "N/A"}
              </span>
              {detail.product?.category && (
                <>
                  <span className="text-slate-400">•</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                    {detail.product.category.name}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              ID Detalle: {detail.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs text-slate-500 mb-1 font-medium">Cantidad</p>
            <div className="bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <p className="text-sm font-bold text-emerald-700">
                {Number(detail.quantity).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 mb-1 font-medium">Precio Unit.</p>
            <div className="bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200">
              <p className="text-sm font-bold text-sky-700">
                S/ {Number(detail.unit_price).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1 font-medium">Subtotal</p>
            <div className="bg-purple-50 px-4 py-1.5 rounded-lg border border-purple-200">
              <p className="text-base font-bold text-purple-700">
                S/ {(parseFloat(detail.quantity) * parseFloat(detail.unit_price)).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GroupItem;