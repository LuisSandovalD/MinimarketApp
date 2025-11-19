import { motion } from "framer-motion";
import { X } from "lucide-react";
// Modal de Detalles de Venta
const SaleDetailsModal = ({ show, sale, onClose }) => {
  if (!show || !sale) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-cyan-50 p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Detalles de Venta</h2>
            <p className="text-sm text-slate-600 mt-1">Venta #{sale.sale_number}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-all"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Cliente</p>
              <p className="font-semibold text-slate-800">{sale.customer?.name || "—"}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Vendedor</p>
              <p className="font-semibold text-slate-800">{sale.user?.name || "—"}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Fecha</p>
              <p className="font-semibold text-slate-800">
                {new Date(sale.date).toLocaleDateString("es-PE", {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Método de Pago</p>
              <p className="font-semibold text-slate-800">{sale.payment_method?.name || "—"}</p>
            </div>
          </div>

          {/* Productos */}
          <div>
            <h3 className="font-semibold text-slate-700 mb-3">Productos</h3>
            <div className="space-y-2">
              {sale.details?.map((detail, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{detail.product?.name || "Producto"}</p>
                    <p className="text-xs text-slate-500">
                      {detail.quantity} unidades × S/ {Number(detail.unit_price).toFixed(2)}
                    </p>
                  </div>
                  <p className="font-bold text-slate-800">
                    S/ {Number(detail.subtotal).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totales */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-5 rounded-lg border border-slate-200">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-semibold text-slate-800">S/ {Number(sale.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">IGV (18%):</span>
                <span className="font-semibold text-slate-800">S/ {Number(sale.vat).toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-300 pt-2 mt-2">
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-slate-800">Total:</span>
                  <span className="font-bold text-blue-600">S/ {Number(sale.total).toFixed(2)}</span>
                </div>
              </div>
              {sale.credit && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm font-semibold text-amber-800 mb-2">Información de Crédito</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-amber-700">Tasa de Interés:</span>
                      <span className="font-semibold">{sale.credit.interest_rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700">Interés:</span>
                      <span className="font-semibold">S/ {Number(sale.credit.interest_amount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700">Fecha de Vencimiento:</span>
                      <span className="font-semibold">
                        {new Date(sale.credit.due_date).toLocaleDateString("es-PE")}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-amber-300">
                      <span className="font-bold text-amber-800">Total con Interés:</span>
                      <span className="font-bold text-amber-800">
                        S/ {(Number(sale.total) + Number(sale.credit.interest_amount || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {sale.notes && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 mb-1">Notas:</p>
              <p className="text-sm text-slate-600">{sale.notes}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
export default SaleDetailsModal;