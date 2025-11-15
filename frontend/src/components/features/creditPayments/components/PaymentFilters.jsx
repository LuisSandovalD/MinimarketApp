import React from "react";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Download,
} from "lucide-react";

export const PaymentFilters = ({
  search,
  setSearch,
  dateFilter,
  setDateFilter,
  sortBy,
  setSortBy,
  sortOrder,
  toggleSortOrder,
  onExport,
  totalFiltered,
  totalPayments,
}) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6">
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Búsqueda */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Buscar por ID, cliente, usuario o notas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-gray-300 focus:outline-none focus:border-transparent text-gray-800 bg-white transition-all"
        />
      </div>

      {/* Filtro por fecha */}
      <div className="flex items-center gap-2">
        <Filter className="text-gray-400" size={18} />
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gray-300 focus:outline-none focus:border-transparent text-gray-700 bg-white transition-all"
        >
          <option value="all">Todas las fechas</option>
          <option value="today">Hoy</option>
          <option value="week">Última semana</option>
          <option value="month">Último mes</option>
        </select>
      </div>

      {/* Ordenar por */}
      <div className="flex items-center gap-2">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gray-300 focus:outline-none focus:border-transparent text-gray-700 bg-white transition-all"
        >
          <option value="date">Fecha</option>
          <option value="amount">Monto</option>
        </select>

        <button
          onClick={toggleSortOrder}
          className="border border-gray-200 rounded-lg p-2.5 hover:bg-gray-50 transition-all"
          title={sortOrder === "asc" ? "Ascendente" : "Descendente"}
        >
          {sortOrder === "asc" ? (
            <SortAsc className="text-gray-600" size={18} />
          ) : (
            <SortDesc className="text-gray-600" size={18} />
          )}
        </button>
      </div>

      {/* Exportar */}
      <button
        onClick={onExport}
        className="px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 transition-all flex items-center gap-2 whitespace-nowrap"
      >
        <Download size={16} />
        Exportar
      </button>
    </div>

    {/* Contador */}
    <div className="mt-3 pt-3 border-t border-gray-100">
      <p className="text-sm text-gray-600">
        Mostrando{" "}
        <span className="font-semibold text-gray-800">{totalFiltered}</span> de{" "}
        <span className="font-semibold text-gray-800">{totalPayments}</span>{" "}
        pagos
      </p>
    </div>
  </div>
);
