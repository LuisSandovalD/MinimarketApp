import { Search, Filter, X, SortAsc, SortDesc } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomersFilters({
  search,
  setSearch,
  showFilters,
  setShowFilters,
  activeFiltersCount,
  filterStatus,
  setFilterStatus,
  filterHasCredits,
  setFilterHasCredits,
  sortBy,
  setSortBy,
  sortOrder,
  toggleSortOrder,
  clearFilters,
}) {
  return (
    <div className="space-y-4 mb-4">
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Buscador */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, DNI/RUC, email, teléfono o dirección..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
          />
        </div>

        {/* Botón de filtros */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
            showFilters || activeFiltersCount > 0
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Filter size={20} />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-white text-blue-600 text-xs rounded-full font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Botón de orden */}
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-xl font-semibold transition-all"
        >
          {sortOrder === "asc" ? <SortAsc size={20} /> : <SortDesc size={20} />}
          Orden
        </button>
      </div>

      {/* Panel de filtros avanzados */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Filtros Avanzados</h3>
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X size={18} />
                <span className="text-sm font-medium">Limpiar filtros</span>
              </button>
            </div>

            {/* Contenido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Estado */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Estado
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>

              {/* Créditos */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Créditos
                </label>
                <select
                  value={filterHasCredits}
                  onChange={(e) => setFilterHasCredits(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="all">Todos</option>
                  <option value="yes">Con créditos pendientes</option>
                  <option value="no">Sin créditos</option>
                </select>
              </div>

              {/* Ordenar por */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="name">Nombre</option>
                  <option value="dni">DNI/RUC</option>
                  <option value="email">Email</option>
                  <option value="phone">Teléfono</option>
                  <option value="credits">Monto de crédito</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
