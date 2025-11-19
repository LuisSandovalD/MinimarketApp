import { motion } from "framer-motion";
import { Search, Filter, SortAsc, SortDesc } from "lucide-react";

export default function ProductFilterBar({
    search, setSearch, filterStatus, setFilterStatus, sortBy, setSortBy,
    sortOrder, toggleSortOrder, viewMode, setViewMode,
    totalFiltered, totalProducts
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm p-5 mb-6"
        >
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, código o categoría..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-sky-200 focus:outline-none focus:border-sky-300 text-slate-800 bg-white transition-all"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="text-slate-400" size={18} />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-200 focus:outline-none focus:border-sky-300 text-slate-700 bg-white transition-all font-medium w-full"
                    >
                        <option value="all">Todos</option>
                        <option value="active">Activos</option>
                        <option value="inactive">Inactivos</option>
                    </select>
                </div>

                <div className="grid col-grid-2 gap-4">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="col-1 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-200 focus:outline-none focus:border-sky-300 text-slate-700 bg-white transition-all font-medium"
                    >
                        <option value="name">Nombre</option>
                        <option value="price">Precio</option>
                        <option value="stock">Stock</option>
                    </select>
                    <button
                        onClick={toggleSortOrder}
                        className="col-2 border border-slate-200 rounded-xl p-3 hover:bg-sky-50 hover:border-sky-200 transition-all"
                        title={sortOrder === "asc" ? "Ascendente" : "Descendente"}
                    >
                        {sortOrder === "asc" ? <SortAsc className="text-slate-600" size={18} /> : <SortDesc className="text-slate-600" size={18} />}
                    </button>
                </div>

                <div>
                    <div className="grid grid-col-2 flex border border-slate-200 rounded-xl overflow-hidden w-full">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`col-1 px-4 py-3 text-sm font-semibold transition-all ${viewMode === "grid" ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`col-2 px-4 py-3 text-sm font-semibold transition-all border-l border-slate-200 ${viewMode === "list" ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                        >
                            Lista
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-600">
                    Mostrando <span className="font-bold text-slate-800">{totalFiltered}</span> de <span className="font-bold text-slate-800">{totalProducts}</span> productos
                </p>
            </div>
        </motion.div>
    );
}