import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, SortAsc, SortDesc, X } from "lucide-react";

export default function SalesFilters({
  search,
  onSearchChange,
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  sortBy,
  onSortChange,
  sortOrder,
  toggleSortOrder,
  activeFiltersCount,
  clearFilters,
  paymentMethods,
  customers,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por número de venta, cliente o vendedor..."
            value={search}
            onChange={onSearchChange}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
          />
        </div>

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

        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-xl font-semibold transition-all"
        >
          {sortOrder === "asc" ? <SortAsc size={20} /> : <SortDesc size={20} />}
          Orden
        </button>
      </div>

      {/* Panel de Filtros */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Desde</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Hasta</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Método de Pago
                </label>
                <select
                  value={filters.paymentMethod}
                  onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="">Todos</option>
                  {paymentMethods.map((pm) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Tipo de Venta
                </label>
                <select
                  value={filters.saleType}
                  onChange={(e) => setFilters({ ...filters, saleType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="">Todos</option>
                  <option value="cash">Contado</option>
                  <option value="credit">Crédito</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Cliente</label>
                <select
                  value={filters.customer}
                  onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="">Todos</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="date">Fecha</option>
                  <option value="number">Número de venta</option>
                  <option value="customer">Cliente</option>
                  <option value="total">Total</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}