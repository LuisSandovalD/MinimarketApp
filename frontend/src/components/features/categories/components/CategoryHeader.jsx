{/* Header + estadísticas */}
import { FullscreenButton } from "../../../common/buttons";
import {PlusCircle, Package} from "lucide-react"
export default function CategoryHeader({ resetForm, setShowModal }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
          <Package className="text-white" size={24} />
        </div>
        <div>
          <h2 className="md:text-1xl lg:text-3xl font-bold text-slate-800 flex items-center gap-3">
            Categorías
          </h2>
          <p className="text-slate-500 mt-1">
            Administra las categorías de productos
          </p>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          <PlusCircle size={20} />
          Nueva Categoría
        </button>

        <FullscreenButton className="shadow" />
      </div>
    </div>
  );
}
