import React from "react";
import { AlertCircle } from "lucide-react";

export const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 max-w-md shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-red-50 rounded-xl border border-red-100">
          <AlertCircle className="text-red-600" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#1E293B]">Error al cargar</h3>
          <p className="text-sm text-[#64748B]">{error}</p>
        </div>
      </div>
      <button
        onClick={onRetry}
        className="w-full px-4 py-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] rounded-lg font-semibold transition-all"
      >
        Reintentar
      </button>
    </div>
  </div>
);