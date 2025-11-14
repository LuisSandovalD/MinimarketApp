import { Ruler, TrendingUp } from "lucide-react";

export default function UnitStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Total de Unidades</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Ruler className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Agregadas Recientemente</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.recentlyAdded}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
