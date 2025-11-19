import React from "react";
import { Wallet, PlusCircle } from "lucide-react";
import { FullscreenButton } from "../../../common/buttons";

export const PaymentHeader = ({ onNewMethod }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <div>
      <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
        <Wallet className="text-slate-600" size={32} />
        Métodos de Pago
      </h1>
      <p className="text-slate-500 mt-1">
        Administra los métodos de pago del sistema
      </p>
    </div>
    <div className="flex justify-between gap-3">
      <button
        onClick={onNewMethod}
        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
      >
        <PlusCircle size={20} />
        Nuevo Método
      </button>
      <FullscreenButton className="shadow"/>
    </div>
  </div>
);