import React from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

export const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-[#E2E8F0]"
  >
    <div className="w-20 h-20 bg-[#F8FAFC] rounded-2xl flex items-center justify-center mb-6 border border-[#E2E8F0]">
      <Building2 size={40} className="text-[#94A3B8]" />
    </div>
    <h3 className="text-xl font-bold text-[#1E293B] mb-2">
      No hay proveedores registrados
    </h3>
    <p className="text-[#64748B] text-center max-w-md">
      Comienza agregando tu primer proveedor usando el botón "Nuevo Proveedor".
    </p>
  </motion.div>
);
