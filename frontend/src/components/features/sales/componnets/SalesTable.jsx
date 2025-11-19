import { motion } from "framer-motion";
import { User, CreditCard, Calendar, Wallet, Eye, Edit, Receipt, Trash2 } from "lucide-react";

export default function SalesTable({ 
  sales, 
  onViewDetails, 
  onEdit, 
  onViewDocument, 
  onDelete,
  currentPageTotal,
  totalAmount 
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">N° Venta</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Cliente</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Vendedor</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Método de Pago</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Fecha</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Tipo</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Total</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <motion.tr
                key={sale.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900">#{sale.sale_number}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <span className="text-gray-900 font-medium">
                      {sale.customer?.name || "—"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-600">{sale.user?.name || "—"}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                    <CreditCard size={12} />
                    {sale.payment_method?.name || "—"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Calendar size={14} />
                    <span className="text-sm">
                      {new Date(sale.date).toLocaleDateString("es-PE")}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {sale.credit ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-semibold rounded-full border border-cyan-200">
                      <CreditCard size={12} />
                      Crédito
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                      <Wallet size={12} />
                      Contado
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-bold text-gray-900">
                    S/ {Number(sale.total).toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onViewDetails(sale)}
                      className="p-2 hover:bg-blue-50 border border-blue-200 text-blue-600 rounded-lg transition-all"
                      title="Ver detalles"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(sale)}
                      className="p-2 hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onViewDocument(sale.id)}
                      className="p-2 hover:bg-cyan-50 border border-cyan-200 text-cyan-600 rounded-lg transition-all"
                      title="Ver documento"
                    >
                      <Receipt size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(sale.id)}
                      className="p-2 hover:bg-red-50 border border-red-200 text-red-600 rounded-lg transition-all"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen al pie de la tabla */}
      <div className="bg-blue-50 border-t border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-semibold text-gray-900">{sales.length}</span>{" "}
            de <span className="font-semibold text-gray-900">{totalAmount}</span> ventas
          </p>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-gray-600">Total en página: </span>
              <span className="font-bold text-blue-600">
                S/ {currentPageTotal.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Total general: </span>
              <span className="font-bold text-blue-600">
                S/ {sales.reduce((sum, s) => sum + Number(s.total), 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}