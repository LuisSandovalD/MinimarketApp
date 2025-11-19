import React from "react";
import { motion } from "framer-motion";
import { CreditCard, Pencil, Trash2 } from "lucide-react";

export const PaymentCard = ({ method, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.2 }}
    className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-200 group"
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-lg">
          <CreditCard className="text-blue-600" size={20} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
          {method.name}
        </h3>
      </div>
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${
          method.active
            ? "bg-green-100 text-green-700"
            : "bg-orange-100 text-orange-700"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            method.active ? "bg-green-500" : "bg-orange-500"
          }`}
        />
        {method.active ? "Activo" : "Inactivo"}
      </span>
    </div>

    <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[2.5rem]">
      {method.description || "Sin descripción"}
    </p>

    <div className="flex gap-2 pt-3 border-t border-slate-100">
      <button
        onClick={() => onEdit(method)}
        className="flex-1 flex items-center justify-center gap-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm"
        title="Editar método"
      >
        <Pencil size={16} />
        Editar
      </button>
      <button
        onClick={() => onDelete(method)}
        className="flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm"
        title="Eliminar método"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </motion.div>
);