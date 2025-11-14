import { ShoppingCart, Hash, ChevronUp, ChevronDown } from "lucide-react";

export const TableView = ({ filteredDetails, sortBy, sortOrder, toggleSort }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                <button
                  onClick={() => toggleSort("shopping_id")}
                  className="flex items-center gap-1 hover:text-sky-600 transition-colors"
                >
                  Compra
                  {sortBy === "shopping_id" && (
                    sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                <button
                  onClick={() => toggleSort("product")}
                  className="flex items-center gap-1 hover:text-sky-600 transition-colors"
                >
                  Producto
                  {sortBy === "product" && (
                    sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                <button
                  onClick={() => toggleSort("quantity")}
                  className="flex items-center gap-1 hover:text-sky-600 transition-colors mx-auto"
                >
                  Cantidad
                  {sortBy === "quantity" && (
                    sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                <button
                  onClick={() => toggleSort("price")}
                  className="flex items-center gap-1 hover:text-sky-600 transition-colors ml-auto"
                >
                  Precio Unit.
                  {sortBy === "price" && (
                    sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredDetails.map((detail, index) => (
              <tr
                key={detail.id}
                className={`hover:bg-sky-50/70 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-sky-100 p-1.5 rounded-lg">
                      <ShoppingCart size={14} className="text-sky-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {detail.shopping?.shopping_number || `#${detail.shopping_id}`}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{detail.product?.name || "N/A"}</p>
                    <p className="text-xs text-slate-500">Código: {detail.product?.code || "N/A"}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                    {detail.product?.category?.name || "Sin categoría"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-sm font-medium text-slate-800">
                    <Hash size={14} className="text-slate-500" />
                    {Number(detail.quantity).toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-medium text-slate-800">
                    S/ {Number(detail.unit_price).toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-bold text-emerald-600">
                    S/ {(parseFloat(detail.quantity) * parseFloat(detail.unit_price)).toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TableView;