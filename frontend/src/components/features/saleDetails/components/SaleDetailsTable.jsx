import React from "react";
import { Package, Hash, Tag, Calendar, User, CreditCard, Clock } from "lucide-react";

export const SaleDetailsTable = ({ details, startIndex, totalGeneral }) => (
  <div className="overflow-hidden bg-white rounded-xl shadow-lg border border-slate-200">
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gradient-to-r from-slate-900 to-slate-800">
          <tr>
            <th className="px-5 py-4 text-left text-xs font-bold text-slate-100 uppercase tracking-wider border-b-2 border-slate-700">
              #
            </th>
            <th className="px-5 py-4 text-left text-xs font-bold text-slate-100 uppercase tracking-wider border-b-2 border-slate-700">
              Info. Venta
            </th>
            <th className="px-5 py-4 text-left text-xs font-bold text-slate-100 uppercase tracking-wider border-b-2 border-slate-700">
              Producto
            </th>
            <th className="px-5 py-4 text-center text-xs font-bold text-slate-100 uppercase tracking-wider border-b-2 border-slate-700">
              Cantidad
            </th>
            <th className="px-5 py-4 text-center text-xs font-bold text-slate-100 uppercase tracking-wider border-b-2 border-slate-700">
              Precio Unit.
            </th>
            <th className="px-5 py-4 text-center text-xs font-bold text-slate-100 uppercase tracking-wider border-b-2 border-slate-700">
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {details.map((detail, index) => (
            <tr
              key={detail.id}
              className="hover:bg-slate-50/80 transition-all duration-200 group"
            >
              {/* Número */}
              <td className="px-5 py-4 align-top">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold text-xs">
                  {startIndex + index + 1}
                </span>
              </td>

              {/* Información de la Venta */}
              <td className="px-5 py-4 align-top">
                <div className="space-y-2.5">
                  {/* Número de Venta */}
                  <div className="flex items-center gap-2">
                    <Hash size={15} className="text-slate-400 flex-shrink-0" />
                    <span className="font-bold text-slate-900">
                      {detail.sale?.sale_number || "—"}
                    </span>
                  </div>

                  {/* Fecha */}
                  {detail.sale?.date && (
                    <div className="flex items-center gap-2">
                      <Calendar size={15} className="text-slate-400 flex-shrink-0" />
                      <span className="text-xs text-slate-600 font-medium">
                        {new Date(detail.sale.date).toLocaleDateString('es-PE', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}

                  {/* Cliente */}
                  {detail.sale?.customer?.name && (
                    <div className="flex items-center gap-2">
                      <User size={15} className="text-slate-400 flex-shrink-0" />
                      <span className="text-xs text-slate-600 font-medium truncate max-w-[180px]">
                        {detail.sale.customer.name}
                      </span>
                    </div>
                  )}

                  {/* Método de Pago */}
                  {detail.sale?.payment_method && (
                    <div className="flex items-center gap-2">
                      <CreditCard size={15} className="text-slate-400 flex-shrink-0" />
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {detail.sale.payment_method === 'cash' ? 'Efectivo' :
                         detail.sale.payment_method === 'credit' ? 'Crédito' :
                         detail.sale.payment_method === 'card' ? 'Tarjeta' :
                         detail.sale.payment_method}
                      </span>
                    </div>
                  )}

                  {/* Estado */}
                  {detail.sale?.status && (
                    <div className="flex items-center gap-2">
                      <Clock size={15} className="text-slate-400 flex-shrink-0" />
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${
                        detail.sale.status === 'completed' || detail.sale.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : detail.sale.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {detail.sale.status === 'completed' ? 'Completado' :
                         detail.sale.status === 'paid' ? 'Pagado' :
                         detail.sale.status === 'pending' ? 'Pendiente' :
                         detail.sale.status}
                      </span>
                    </div>
                  )}

                  {/* Total de la Venta */}
                  {detail.sale?.total && (
                    <div className="pt-1.5 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">Total venta:</span>
                        <span className="text-xs font-bold text-slate-900">
                          S/ {parseFloat(detail.sale.total).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>

              {/* Producto */}
              <td className="px-5 py-4 align-top">
                {detail.product?.name ? (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-300 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Package size={18} className="text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-slate-900 block">
                        {detail.product.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <Tag size={12} className="text-slate-400" />
                          {detail.product.code}
                        </span>
                        {detail.product.category && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs text-slate-500 font-medium">
                              {detail.product.category}
                            </span>
                          </>
                        )}
                      </div>
                      {detail.product.description && (
                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                          {detail.product.description}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">
                    Producto ID: {detail.product_id}
                  </span>
                )}
              </td>

              {/* Cantidad */}
              <td className="px-5 py-4 text-center align-top">
                <span className="inline-flex items-center justify-center px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-bold text-sm">
                  {detail.quantity}
                </span>
              </td>

              {/* Precio Unitario */}
              <td className="px-5 py-4 text-center align-top">
                <span className="text-slate-700 font-semibold">
                  S/ {parseFloat(detail.unit_price).toFixed(2)}
                </span>
              </td>

              {/* Subtotal */}
              <td className="px-5 py-4 text-center align-top">
                <span className="inline-flex items-center justify-center px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-bold shadow-sm">
                  S/ {parseFloat(detail.subtotal).toFixed(2)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gradient-to-r from-slate-900 to-slate-800 border-t-2 border-slate-700">
            <td
              colSpan={5}
              className="px-5 py-5 text-right font-bold text-slate-100 text-sm uppercase tracking-wider"
            >
              Total General:
            </td>
            <td className="px-5 py-5 text-center">
              <span className="inline-flex items-center justify-center px-4 py-2 bg-white border-2 border-slate-200 rounded-lg text-slate-900 font-black text-lg shadow-lg">
                S/ {totalGeneral.toFixed(2)}
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
);