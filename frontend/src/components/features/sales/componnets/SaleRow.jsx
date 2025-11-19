import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User, Wallet, Calendar, CreditCard, DollarSign, Edit, Trash2, FileText, Eye } from "lucide-react";

const SaleRow = ({ sale, onEdit, onDelete, onViewDocument, onViewDetails, index }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        className="hover:bg-blue-50 transition-all cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <td className="p-4 border-b border-slate-200 font-bold text-slate-800">
          <div className="flex items-center gap-2">
            <ChevronDown 
              size={16} 
              className={`text-slate-400 transition-transform ${showDetails ? 'rotate-180' : ''}`}
            />
            {sale.sale_number}
          </div>
        </td>
        <td className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
              <User size={14} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-800">
              {sale.customer?.name || "—"}
            </span>
          </div>
        </td>
        <td className="p-4 border-b border-slate-200 text-sm text-slate-600">
          {sale.user?.name || "—"}
        </td>
        <td className="p-4 border-b border-slate-200">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
            <Wallet size={12} />
            {sale.payment_method?.name || "—"}
          </span>
        </td>
        <td className="p-4 border-b border-slate-200 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            {new Date(sale.date).toLocaleDateString("es-PE")}
          </div>
        </td>
        <td className="p-4 border-b border-slate-200">
          {sale.credit ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-bold">
              <CreditCard size={12} />
              Crédito ({sale.credit.interest_rate}%)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-bold">
              <DollarSign size={12} />
              Contado
            </span>
          )}
        </td>
        <td className="p-4 border-b border-slate-200 text-right">
          <div>
            <span className="text-sm font-bold text-slate-800">
              S/ {Number(sale.total).toFixed(2)}
            </span>
            {sale.credit && (
              <div className="text-xs text-amber-600 mt-1">
                + Int: S/ {Number(sale.credit.interest_amount || 0).toFixed(2)}
              </div>
            )}
          </div>
        </td>
        <td className="p-4 border-b border-slate-200" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(sale);
              }}
              className="p-2 hover:bg-cyan-50 border border-transparent hover:border-cyan-200 rounded-lg transition-all group"
              title="Ver detalles"
            >
              <Eye size={16} className="text-slate-500 group-hover:text-cyan-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(sale);
              }}
              className="p-2 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg transition-all group"
              title="Editar"
            >
              <Edit size={16} className="text-slate-500 group-hover:text-blue-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(sale.id);
              }}
              className="p-2 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg transition-all group"
              title="Eliminar"
            >
              <Trash2 size={16} className="text-slate-500 group-hover:text-red-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDocument(sale.id);
              }}
              className="p-2 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 rounded-lg transition-all group"
              title="Ver comprobante"
            >
              <FileText size={16} className="text-slate-500 group-hover:text-emerald-600" />
            </button>
          </div>
        </td>
      </motion.tr>
      
      {/* Fila expandible con detalles */}
      <AnimatePresence>
        {showDetails && (
          <motion.tr
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-50"
          >
            <td colSpan="8" className="p-4 border-b border-slate-200">
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-700 mb-2">Productos de la venta:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sale.details?.map((detail, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-slate-800">{detail.product?.name || "Producto"}</p>
                          <p className="text-xs text-slate-500">Código: {detail.product?.code || "—"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-700">
                            {detail.quantity} x S/ {Number(detail.unit_price).toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-500">
                            Total: S/ {Number(detail.subtotal).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {sale.notes && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">Notas:</span> {sale.notes}
                    </p>
                  </div>
                )}
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
};

export default SaleRow;
