import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, DollarSign, Box, Filter, SortAsc, SortDesc } from "lucide-react";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import { getProducts } from "../../../api/product";
import NotificationButton from "../../../components/common/NotificationButton";
import Loading from "../../../components/common/Loading";


export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Estados para filtros y ordenamiento
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive
  const [sortBy, setSortBy] = useState("name"); // name, price, stock
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc
  const [viewMode, setViewMode] = useState("grid"); // grid, list

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFiltered(data);
      } catch (err) {
        setError("Error cargando productos: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Aplicar búsqueda
    const query = search.toLowerCase();
    if (query) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.code.toLowerCase().includes(query) ||
          p.category?.name?.toLowerCase().includes(query)
      );
    }

    // Aplicar filtro de estado
    if (filterStatus !== "all") {
      result = result.filter((p) => 
        filterStatus === "active" ? p.active : !p.active
      );
    }

    // Aplicar ordenamiento
    result.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "price":
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case "stock":
          aValue = a.stock_current || 0;
          bValue = b.stock_current || 0;
          break;
        case "name":
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFiltered(result);
  }, [search, products, filterStatus, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Obtener estadísticas
  const stats = {
    total: products.length,
    active: products.filter(p => p.active).length,
    inactive: products.filter(p => !p.active).length,
    lowStock: products.filter(p => (p.stock_current || 0) < 10).length,
  };

  if (loading) return <Loading />;

  if (error)
    return <p className="text-red-400 p-6 font-medium">{error}</p>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] lg:pt-0 pt-16">
      <div className="flex-1 p-8 ml-0 lg:ml-72 transition-all duration-300">
        <div className="mb-8">
          <NavBarAdmin />
          {/* Encabezado */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">
                Lista de Productos
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Gestiona y visualiza tu inventario
              </p>
            </div>
            <NotificationButton />
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Total</p>
                  <p className="text-2xl font-semibold text-gray-800">{stats.total}</p>
                </div>
                <Package className="text-gray-400" size={32} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Activos</p>
                  <p className="text-2xl font-semibold text-gray-800">{stats.active}</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Inactivos</p>
                  <p className="text-2xl font-semibold text-gray-800">{stats.inactive}</p>
                </div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Stock Bajo</p>
                  <p className="text-2xl font-semibold text-gray-800">{stats.lowStock}</p>
                </div>
                <Box className="text-gray-400" size={32} />
              </div>
            </motion.div>
          </div>

          {/* Barra de búsqueda y filtros */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Búsqueda */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, código o categoría..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-gray-300 focus:outline-none focus:border-transparent text-gray-800 bg-white transition-all"
                />
              </div>

              {/* Filtro de estado */}
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400" size={18} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gray-300 focus:outline-none focus:border-transparent text-gray-700 bg-white transition-all"
                >
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>

              {/* Ordenar por */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gray-300 focus:outline-none focus:border-transparent text-gray-700 bg-white transition-all"
                >
                  <option value="name">Nombre</option>
                  <option value="price">Precio</option>
                  <option value="stock">Stock</option>
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

              {/* Modo de vista */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2.5 text-sm font-medium transition-all ${
                    viewMode === "grid"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2.5 text-sm font-medium transition-all border-l border-gray-200 ${
                    viewMode === "list"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Lista
                </button>
              </div>
            </div>

            {/* Contador de resultados */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Mostrando{" "}
                <span className="font-semibold text-gray-800">{filtered.length}</span> de{" "}
                <span className="font-semibold text-gray-800">{products.length}</span>{" "}
                productos
              </p>
            </div>
          </motion.div>

          {/* Vista de productos */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              viewMode === "grid" ? (
                // Vista Grid
                <motion.div
                  key="grid"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {filtered.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h2 className="text-lg font-semibold text-gray-800 flex-1">
                          {item.name}
                        </h2>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ml-2 ${
                            item.active
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-red-50 text-red-600 border border-red-200"
                          }`}
                        >
                          {item.active ? "Activo" : "Inactivo"}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Código:</span>
                          <span className="font-medium text-gray-800">{item.code}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Categoría:</span>
                          <span className="font-medium text-gray-800">
                            {item.category?.name ?? "—"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Unidad:</span>
                          <span className="font-medium text-gray-800">
                            {item.category?.unit?.abbreviation ?? "—"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Precio:</span>
                          <span className="font-semibold text-gray-800">
                            S/ {Number(item.price).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stock:</span>
                          <span
                            className={`font-semibold ${
                              (item.stock_current || 0) < 10
                                ? "text-red-600"
                                : "text-gray-800"
                            }`}
                          >
                            {item.stock_current ?? 0}
                            {(item.stock_current || 0) < 10 && " ⚠️"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Valor en stock:</span>
                          <span className="font-semibold text-gray-800">
                            S/ {(item.price * (item.stock_current || 0)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                // Vista Lista
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-700">
                            Producto
                          </th>
                          <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-700">
                            Código
                          </th>
                          <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-700">
                            Categoría
                          </th>
                          <th className="px-4 py-3.5 text-center text-xs font-medium text-gray-700">
                            Precio
                          </th>
                          <th className="px-4 py-3.5 text-center text-xs font-medium text-gray-700">
                            Stock
                          </th>
                          <th className="px-4 py-3.5 text-center text-xs font-medium text-gray-700">
                            Valor Total
                          </th>
                          <th className="px-4 py-3.5 text-center text-xs font-medium text-gray-700">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((item, index) => (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3.5">
                              <span className="font-medium text-gray-800">{item.name}</span>
                            </td>
                            <td className="px-4 py-3.5 text-gray-700">{item.code}</td>
                            <td className="px-4 py-3.5 text-gray-700">
                              {item.category?.name ?? "—"}
                            </td>
                            <td className="px-4 py-3.5 text-center font-semibold text-gray-800">
                              S/ {Number(item.price).toFixed(2)}
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span
                                className={`font-semibold ${
                                  (item.stock_current || 0) < 10
                                    ? "text-red-600"
                                    : "text-gray-800"
                                }`}
                              >
                                {item.stock_current ?? 0}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-center font-semibold text-gray-800">
                              S/ {(item.price * (item.stock_current || 0)).toFixed(2)}
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span
                                className={`text-xs px-2.5 py-1 rounded-full font-medium inline-block ${
                                  item.active
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-600 border border-red-200"
                                }`}
                              >
                                {item.active ? "Activo" : "Inactivo"}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white rounded-xl border border-gray-200"
              >
                <Package className="mx-auto text-gray-300 mb-4" size={64} />
                <p className="text-gray-500 text-lg font-medium">
                  No se encontraron productos
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Intenta ajustar los filtros o la búsqueda
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Total general */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-gray-800 text-white rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign size={24} />
                <span className="text-lg font-medium">Valor Total del Inventario:</span>
              </div>
              <span className="text-2xl font-bold">
                S/{" "}
                {filtered
                  .reduce(
                    (acc, item) =>
                      acc + (item.price || 0) * (item.stock_current || 0),
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}