import { FileText, Download } from "lucide-react";

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
      
      <button
        onClick={onExport}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        <Download size={20} />
        Exportar CSV
      </button>
    </div>
  );
};
export default ShoppingDetailHeader;
