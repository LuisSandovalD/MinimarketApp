export default function ShoppingFilters({
  filters,
  onFilterChange,
  suppliers,
  users,
  onClear,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <select
        value={filters.supplierId}
        onChange={(e) => onFilterChange("supplierId", e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm "
      >
        <option value="">Proveedor</option>
        {suppliers.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        value={filters.userId}
        onChange={(e) => onFilterChange("userId", e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Usuario</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={filters.dateFrom}
        onChange={(e) => onFilterChange("dateFrom", e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />

      <input
        type="date"
        value={filters.dateTo}
        onChange={(e) => onFilterChange("dateTo", e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />

      <input
        type="number"
        placeholder="Monto mínimo"
        value={filters.minAmount}
        onChange={(e) => onFilterChange("minAmount", e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />

      <input
        type="number"
        placeholder="Monto máximo"
        value={filters.maxAmount}
        onChange={(e) => onFilterChange("maxAmount", e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />

      <button
        onClick={onClear}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-4 py-2 text-sm transition-all col-span-full md:col-span-1"
      >
        Limpiar filtros
      </button>
    </div>
  );
}
