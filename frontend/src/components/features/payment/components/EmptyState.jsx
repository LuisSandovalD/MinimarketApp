import React from "react";
import { motion } from "framer-motion";
import { Wallet, PlusCircle } from "lucide-react";

export const EmptyState = ({ search, filterStatus, onNewMethod }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200"
  >
    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
      <Wallet className="text-slate-400" size={32} />
    </div>
    <h3 className="text-lg font-semibold text-slate-700 mb-2">
      No se encontraron métodos de pago
    </h3>
    <p className="text-slate-500 mb-6">
      {search || filterStatus !== "all"
        ? "Intenta ajustar los filtros de búsqueda"
        : "Comienza creando tu primer método de pago"}
    </p>
    {!search && filterStatus === "all" && (
      <button
        onClick={onNewMethod}
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium"
      >
        <PlusCircle size={18} />
        Crear Método de Pago
      </button>
    )}
  </motion.div>
);