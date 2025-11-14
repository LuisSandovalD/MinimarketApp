import { TrendingUp, CreditCard, Wallet } from "lucide-react";

export default function SalesStats({ totalSales, totalCredit, totalCash, salesCount, creditCount, cashCount }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500 rounded-xl">
            <TrendingUp className="text-white" size={22} />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Ventas Totales</p>
            <p className="text-2xl font-bold text-gray-900">S/ {totalSales.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">{salesCount} ventas</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500 rounded-xl">
            <CreditCard className="text-white" size={22} />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Ventas a Crédito</p>
            <p className="text-2xl font-bold text-gray-900">S/ {totalCredit.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">{creditCount} ventas a crédito</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500 rounded-xl">
            <Wallet className="text-white" size={22} />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Ventas al Contado</p>
            <p className="text-2xl font-bold text-gray-900">S/ {totalCash.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">{cashCount} ventas al contado</p>
          </div>
        </div>
      </div>
    </div>
  );
}