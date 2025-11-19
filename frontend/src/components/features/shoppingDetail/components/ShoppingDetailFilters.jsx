import { Search, ShoppingCart, Filter, ChevronDown, ChevronUp, X, List, Grid3x3, Layers } from "lucide-react";

export const ShoppingDetailFilters = ({
  searchTerm,
  setSearchTerm,
  selectedShopping,
  setSelectedShopping,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  uniqueShoppings,
  clearFilters,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div className="md:col-span-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por producto, código o compra..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800 placeholder-slate-400 bg-slate-50 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="relative">
              <ShoppingCart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              <select
                value={selectedShopping}
                onChange={(e) => setSelectedShopping(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800 bg-slate-50 appearance-none transition-all"
              >
                <option value="">Todas las compras</option>
                {uniqueShoppings.map((shopping) => (
                  <option key={shopping.id} value={shopping.id}>
                    {shopping.number}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800 bg-slate-50 appearance-none transition-all"
              >
                <option value="shopping_id">Ordenar por Compra</option>
                <option value="product">Ordenar por Producto</option>
                <option value="quantity">Ordenar por Cantidad</option>
                <option value="price">Ordenar por Precio</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="md:col-span-1">
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="w-full h-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-600 rounded-xl transition-all"
              title={sortOrder === "asc" ? "Orden ascendente" : "Orden descendente"}
            >
              {sortOrder === "asc" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          {searchTerm || selectedShopping ? (
            <button
              onClick={clearFilters}
              className="text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors flex items-center gap-1"
            >
              <X size={16} />
              Limpiar filtros
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2.5 rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-sky-500 text-white shadow-md"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-300"
              }`}
              title="Vista tabla"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`p-2.5 rounded-lg transition-all ${
                viewMode === "cards"
                  ? "bg-sky-500 text-white shadow-md"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-300"
              }`}
              title="Vista tarjetas"
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode("grouped")}
              className={`p-2.5 rounded-lg transition-all ${
                viewMode === "grouped"
                  ? "bg-sky-500 text-white shadow-md"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-300"
              }`}
              title="Vista agrupada"
            >
              <Layers size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShoppingDetailFilters;
