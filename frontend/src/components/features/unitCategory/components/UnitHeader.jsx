import { Ruler } from "lucide-react";
import { FullscreenButton } from "../../../common/buttons";


export default function UnitHeader({ handleOpenForm }) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

      {/* Título y descripción */}
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
          <Ruler className="text-white" size={24} />
        </div>
        <div>
          <h1 className="md:text-1xl lg:text-3xl font-bold text-slate-800">Unidades de Medida</h1>
          <p className="text-slate-500 mt-1">Administra las unidades del sistema</p>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={handleOpenForm}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          Nueva Unidad
        </button>

        <FullscreenButton className="shadow" />
      </div>

    </div>
  );
}
