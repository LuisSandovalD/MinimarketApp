import { ShoppingCart, Package } from "lucide-react";

export const CardsView = ({ filteredDetails }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredDetails.map((detail) => (
        <div
          key={detail.id}
          className="bg-white rounded-xl border border-slate-200 hover:shadow-xl transition-all overflow-hidden transform hover:scale-[1.02]"
        >
          <div className="bg-gradient-to-r from-sky-50/80 via-sky-50/50 to-slate-50 p-5 border-b border-slate-200">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-sky-500 p-2 rounded-lg shadow-md">
                  <ShoppingCart className="text-white" size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">Compra</p>
                  <p className="text-sm font-bold text-slate-800">
                    {detail.shopping?.shopping_number || `#${detail.shopping_id}`}
                  </p>
                </div>
              </div>
              <div className="bg-white px-3 py-1 rounded-full border border-sky-200">
                <p className="text-xs font-medium text-sky-700">ID: {detail.id}</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-2.5 rounded-lg border border-sky-200">
                <Package className="text-sky-600" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 mb-1 font-medium">Producto</p>
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {detail.product?.name || "N/A"}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Código: {detail.product?.code || "N/A"}
                </p>
              </div>
            </div>

            {detail.product?.category && (
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-xs text-slate-600 mb-1">Categoría</p>
                <p className="text-sm font-medium text-slate-800">
                  {detail.product.category?.name}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                <p className="text-xs text-emerald-700 mb-1 font-medium">Cantidad</p>
                <p className="text-lg font-bold text-emerald-800">
                  {Number(detail.quantity).toFixed(2)}
                </p>
              </div>
              <div className="bg-sky-50 rounded-lg p-3 border border-sky-200">
                <p className="text-xs text-sky-700 mb-1 font-medium">Precio Unit.</p>
                <p className="text-lg font-bold text-sky-800">
                  S/ {Number(detail.unit_price).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm font-medium">Subtotal</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  S/ {(parseFloat(detail.quantity) * parseFloat(detail.unit_price)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default CardsView;