import { motion } from "framer-motion";
import { Receipt } from "lucide-react";

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200"
  >
    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 border border-slate-200">
      <Receipt size={40} className="text-slate-400" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">No hay ventas registradas</h3>
    <p className="text-slate-600 text-center max-w-md">
      Comienza agregando tu primera venta usando el botón "Nueva Venta".
    </p>
  </motion.div>
);

export default EmptyState;
