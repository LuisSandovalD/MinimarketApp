import React from "react";
import { Search, Filter, FileText, Download, X } from "lucide-react";

export const FilterBar = ({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  categoryFilter,
  setCategoryFilter,
  saleFilter,
  setSaleFilter,
  categories,
  sales,
  clearFilters,
  onExportPDF,
  onExportExcel,
  onSearchChange,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
    <div className="flex flex-col md:flex-row gap-4">
      {/* Búsqueda */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por producto o código..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearchChange?.();
          }}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
            showFilters
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filtros</span>
        </button>
        <button
          onClick={onExportPDF}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
          title="Exportar a PDF"
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">PDF</span>
        </button>
        <button
          onClick={onExportExcel}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
          title="Exportar a Excel"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Excel</span>
        </button>
      </div>
    </div>

    {/* Panel de filtros expandible */}
    {showFilters && (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Categoría
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                onSearchChange?.();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Venta ID
            </label>
            <select
              value={saleFilter}
              onChange={(e) => {
                setSaleFilter(e.target.value);
                onSearchChange?.();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="">Todas las ventas</option>
              {sales.map((sale) => (
                <option key={sale} value={sale}>
                  Venta #{sale}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);