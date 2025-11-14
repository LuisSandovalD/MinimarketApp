import { Search, TrendingUp } from "lucide-react";

export default function UnitFilters({ searchTerm, setSearchTerm, sortOrder, toggleSortOrder, filteredCount, totalCount }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Buscar por nombre o abreviatura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full border border-slate-300 rounded-lg bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          />
        </div>

        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all font-medium text-sm"
        >
          <TrendingUp
            size={16}
            className={`transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
          />
          {sortOrder === "asc" ? "A-Z" : "Z-A"}
        </button>
      </div>

      {searchTerm && (
        <p className="text-sm text-slate-500 mt-3">
          Mostrando <b>{filteredCount}</b> de <b>{totalCount}</b> unidades
        </p>
      )}
    </div>
  );
}
