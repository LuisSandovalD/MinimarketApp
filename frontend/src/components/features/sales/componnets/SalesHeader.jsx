import { Plus } from "lucide-react";
import SalesExportMenu from "./SalesExportMenu";
import { FullscreenButton } from "../../../common/buttons";


export default function SalesHeader({ onNewSale, sales }) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Gestión de Ventas</h2>
        <p className="text-gray-600">Administra todas tus ventas y transacciones</p>
      </div>
      <div className="flex gap-3">
        <SalesExportMenu sales={sales} />

        <button
          onClick={onNewSale}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
        >
          <Plus size={20} />
          Nueva Venta
        </button>
        <FullscreenButton className="shadow" />
      </div>
    </div>
  );
}