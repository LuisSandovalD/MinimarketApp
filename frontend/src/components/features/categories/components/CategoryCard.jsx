export default function CategoryCard({ cat, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      {/* Título y estado */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-slate-800">{cat.name}</h3>
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
            cat.active
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {cat.active ? "Activo" : "Inactivo"}
        </span>
      </div>

      {/* Descripción */}
      <p className="text-sm text-slate-600 mb-3">
        {cat.description || "Sin descripción"}
      </p>

      {/* Unidad */}
      <div className="bg-slate-50 rounded-lg p-3 mb-5">
        <p className="text-xs text-slate-500 font-medium mb-0.5">
          Unidad de Medida
        </p>
        <p className="text-sm font-semibold text-slate-700">
          {cat.unit?.name} ({cat.unit?.abbreviation})
        </p>
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <button
          onClick={() => onEdit(cat)}
          className="flex-1 text-center bg-blue-100 text-blue-700 font-medium rounded-lg py-2 hover:bg-blue-200 active:scale-95 transition-all duration-150"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(cat.id)}
          className="flex-1 text-center bg-red-100 text-red-700 font-medium rounded-lg py-2 hover:bg-red-200 active:scale-95 transition-all duration-150"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
