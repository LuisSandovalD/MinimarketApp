import React from "react";
import { Receipt } from "lucide-react";

export const EmptyState = ({ search, dateFilter }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
    <Receipt className="mx-auto text-gray-300 mb-4" size={48} />
    <p className="text-gray-500 font-medium">No hay pagos registrados</p>
    <p className="text-gray-400 text-sm mt-1">
      {search || dateFilter !== "all"
        ? "Intenta ajustar los filtros o la búsqueda"
        : "Los pagos aparecerán aquí cuando se registren"}
    </p>
  </div>
);