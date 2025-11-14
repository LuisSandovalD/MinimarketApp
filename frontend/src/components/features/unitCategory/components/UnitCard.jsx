export default function UnitCard({ unit, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-slate-800">{unit.name}</h3>
        <p className="text-sm text-slate-500">{unit.abbreviation}</p>
      </div>
      <div className="flex gap-3 pt-3 border-t border-slate-100">
        <button
          onClick={() => onEdit(unit)}
          className="flex-1 text-center bg-blue-100 text-blue-700 font-medium rounded-lg py-2 hover:bg-blue-200 active:scale-95 transition-all"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(unit)}
          className="flex-1 text-center bg-red-100 text-red-700 font-medium rounded-lg py-2 hover:bg-red-200 active:scale-95 transition-all"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
