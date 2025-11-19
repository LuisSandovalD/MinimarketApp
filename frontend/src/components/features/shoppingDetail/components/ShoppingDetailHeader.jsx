import { FileText, Download } from "lucide-react";
import { FullscreenButton } from "../../../common/buttons";


export const ShoppingDetailHeader = ({ onExport }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-3 rounded-xl shadow-lg">
          <FileText className="text-white" size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Detalles de Compras</h2>
          <p className="text-slate-600 text-sm">
            Visualización detallada de todos los productos comprados
          </p>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
        >
          <Download size={20} />
          Exportar CSV
        </button>
        <FullscreenButton className="shadow" />
      </div>
      
    </div>
  );
};
export default ShoppingDetailHeader;
