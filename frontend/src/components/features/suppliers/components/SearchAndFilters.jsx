import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, SortAsc, SortDesc, X } from "lucide-react";

export const SearchAndFilters = ({
  search,
  setSearch,
  showFilters,
  setShowFilters,
  activeFiltersCount,
  toggleSortOrder,
  sortOrder,
  filterStatus,
  setFilterStatus,
  filterHasEmail,
  setFilterHasEmail,
  filterHasPhone,
  setFilterHasPhone,
  sortBy,
  setSortBy,
  clearFilters,
}) => (
  <div className="space-y-4">
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          size={20}
        />
        <input
          type="text"
          placeholder="Buscar por nombre, RUC, email, teléfono o dirección..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-[#E2E8F0] rounded-xl bg-white text-[#1E293B] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#CBD5E1] focus:border-[#CBD5E1] outline-none transition-all"
        />
      </div>

      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
          showFilters || activeFiltersCount > 0
            ? "bg-[#CBD5E1] text-[#1E293B]"
            : "bg-white border border-[#E2E8F0] text-[#1E293B] hover:bg-[#F8FAFC]"
        }`}
      >
        <Filter size={20} />
        Filtros
        {activeFiltersCount > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-[#1E293B] text-white text-xs rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      <button
        onClick={toggleSortOrder}
        className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] rounded-xl font-semibold transition-all"
      >
        {sortOrder === "asc" ? <SortAsc size={20} /> : <SortDesc size={20} />}
        Orden
      </button>
    </div>

    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-xl border border-[#E2E8F0] p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#1E293B]">Filtros Avanzados</h3>
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-[#64748B] hover:text-[#1E293B] transition-colors"
            >
              <X size={18} />
              <span className="text-sm font-medium">Limpiar filtros</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#64748B] mb-2">
                Estado
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:ring-2 focus:ring-[#CBD5E1] outline-none"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#64748B] mb-2">
                Email
              </label>
              <select
                value={filterHasEmail}
                onChange={(e) => setFilterHasEmail(e.target.value)}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:ring-2 focus:ring-[#CBD5E1] outline-none"
              >
                <option value="all">Todos</option>
                <option value="yes">Con email</option>
                <option value="no">Sin email</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#64748B] mb-2">
                Teléfono
              </label>
              <select
                value={filterHasPhone}
                onChange={(e) => setFilterHasPhone(e.target.value)}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:ring-2 focus:ring-[#CBD5E1] outline-none"
              >
                <option value="all">Todos</option>
                <option value="yes">Con teléfono</option>
                <option value="no">Sin teléfono</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#64748B] mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:ring-2 focus:ring-[#CBD5E1] outline-none"
              >
                <option value="name">Nombre</option>
                <option value="ruc">RUC</option>
                <option value="email">Email</option>
                <option value="phone">Teléfono</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);