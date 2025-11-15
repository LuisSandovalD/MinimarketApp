import { motion } from "framer-motion";
import { Users, UserPlus } from "lucide-react";

export default function EmptyStateNoFilters({ setSelectedCustomer, setModalOpen }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200"
    >
      <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-200">
        <Users size={40} className="text-blue-500" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">No hay clientes registrados</h3>

      <p className="text-gray-600 text-center max-w-md mb-6">
        Comienza agregando tu primer cliente usando el botón "Nuevo Cliente".
      </p>

      <button
        onClick={() => {
          setSelectedCustomer(null);
          setModalOpen(true);
        }}
        className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
      >
        <UserPlus size={20} />
        Agregar Cliente
      </button>
    </motion.div>
  );
}
