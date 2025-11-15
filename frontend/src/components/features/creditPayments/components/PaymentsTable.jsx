import React from "react";
import { User } from "lucide-react";

export const PaymentsTable = ({ payments, montoTotal }) => (
  <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-700">
              ID
            </th>
            <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-700">
              Cliente / Estado
            </th>
            <th className="py-3.5 px-4 text-right text-xs font-medium text-gray-700">
              Monto
            </th>
            <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-700">
              Fecha de Pago
            </th>
            <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-700">
              Usuario
            </th>
            <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-700">
              Notas
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((pago) => (
            <tr
              key={pago.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3.5 px-4 text-gray-700 font-medium">
                #{pago.id}
              </td>
              <td className="py-3.5 px-4">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">
                    {pago.credit?.sale?.customer?.name || "—"}
                  </span>
                  {pago.credit?.status && (
                    <span className="text-xs text-gray-500 mt-0.5">
                      {pago.credit.status}
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3.5 px-4 text-right font-semibold text-gray-800">
                S/ {parseFloat(pago.amount || 0).toFixed(2)}
              </td>
              <td className="py-3.5 px-4 text-gray-700">
                {new Date(pago.payment_date).toLocaleString("es-PE", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </td>
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <span className="text-gray-700">
                    {pago.user?.name || pago.user_id || "—"}
                  </span>
                </div>
              </td>
              <td className="py-3.5 px-4 text-gray-600 text-sm max-w-xs truncate">
                {pago.notes || "—"}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50 border-t-2 border-gray-300">
          <tr>
            <td
              colSpan={2}
              className="py-4 px-4 text-right font-semibold text-gray-700"
            >
              TOTAL:
            </td>
            <td className="py-4 px-4 text-right font-bold text-gray-800 text-base">
              S/ {montoTotal.toFixed(2)}
            </td>
            <td colSpan={3}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
);
