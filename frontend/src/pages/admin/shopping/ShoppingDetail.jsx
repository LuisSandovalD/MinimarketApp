import { useEffect, useState, useMemo } from "react";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import {
  getShoppingDetail,
} from "../../../api/shoppingDetail";
import {
  Search,
  Filter,
  FileText,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  BarChart3,
  Grid3x3,
  List,
  Layers,
  Box,
  Hash
} from "lucide-react";
import Loading from "../../../components/common/Loading";


const ShoppingDetail = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grouped"); // 'table', 'cards', 'grouped'
  const [sortBy, setSortBy] = useState("shopping_id"); // 'shopping_id', 'product', 'quantity', 'price'
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc', 'desc'
  const [expandedGroups, setExpandedGroups] = useState({});
  const [selectedShopping, setSelectedShopping] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getShoppingDetail();
        setDetails(data);
      } catch (error) {
        console.error("Error al cargar detalles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrado y búsqueda
  const filteredDetails = useMemo(() => {
    let filtered = [...details];

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (detail) =>
          detail.product_id?.toString().includes(searchTerm.toLowerCase()) ||
          detail.shopping_id?.toString().includes(searchTerm.toLowerCase()) ||
          detail.quantity?.toString().includes(searchTerm)
      );
    }

    // Filtro por compra específica
    if (selectedShopping) {
      filtered = filtered.filter(
        (detail) => detail.shopping_id?.toString() === selectedShopping
      );
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case "shopping_id":
          aVal = a.shopping_id || 0;
          bVal = b.shopping_id || 0;
          break;
        case "product":
          aVal = a.product_id || 0;
          bVal = b.product_id || 0;
          break;
        case "quantity":
          aVal = parseFloat(a.quantity) || 0;
          bVal = parseFloat(b.quantity) || 0;
          break;
        case "price":
          aVal = parseFloat(a.unit_price) || 0;
          bVal = parseFloat(b.unit_price) || 0;
          break;
        default:
          aVal = a.id;
          bVal = b.id;
      }

      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [details, searchTerm, selectedShopping, sortBy, sortOrder]);

  // Agrupar por compra
  const groupedDetails = useMemo(() => {
    const groups = {};
    filteredDetails.forEach((detail) => {
      const shoppingId = detail.shopping_id || "Sin compra";
      if (!groups[shoppingId]) {
        groups[shoppingId] = [];
      }
      groups[shoppingId].push(detail);
    });
    return groups;
  }, [filteredDetails]);

  // Estadísticas
  const stats = useMemo(() => {
    const totalItems = filteredDetails.reduce(
      (sum, d) => sum + (parseFloat(d.quantity) || 0),
      0
    );
    const totalValue = filteredDetails.reduce(
      (sum, d) => sum + (parseFloat(d.subtotal) || 0),
      0
    );
    const uniqueProducts = new Set(
      filteredDetails.map((d) => d.product_id)
    ).size;
    const uniqueShoppings = new Set(
      filteredDetails.map((d) => d.shopping_id)
    ).size;

    return {
      totalDetails: filteredDetails.length,
      totalItems: totalItems.toFixed(2),
      totalValue: totalValue.toFixed(2),
      uniqueProducts,
      uniqueShoppings,
      averagePrice:
        filteredDetails.length > 0
          ? (totalValue / filteredDetails.length).toFixed(2)
          : "0.00",
    };
  }, [filteredDetails]);

  // Obtener lista única de compras para el filtro
  const uniqueShoppings = useMemo(() => {
    return [...new Set(details.map((d) => d.shopping_id))].sort((a, b) => b - a);
  }, [details]);

  const toggleGroup = (shoppingId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [shoppingId]: !prev[shoppingId],
    }));
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "ID Compra", "ID Producto", "Cantidad", "Precio Unit.", "Subtotal"];
    const rows = filteredDetails.map((d) => [
      d.id,
      d.shopping_id,
      d.product_id,
      d.quantity,
      d.unit_price,
      d.subtotal,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `detalles-compra-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) return <Loading/>;
  

  return (
    <div className="min-h-screen bg-[#F8FAFC] lg:pt-0">
     <div className="flex-1 ml-0  transition-all duration-300">
       <NavBarAdmin />

        <main className="flex-1 lg:ml-72 pt-20 lg:pt-0 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-[#1E293B] mb-2">
                  Detalles de Compras
                </h1>
                <p className="text-[#64748B]">
                  Visualización detallada de todos los productos comprados
                </p>
              </div>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-[#1E293B] hover:bg-[#334155] text-white px-6 py-3 rounded-lg shadow-sm transition-all"
              >
                <Download size={20} />
                Exportar CSV
              </button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#FFFFFF] rounded-lg p-5 border border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#64748B] text-sm mb-1">Total Registros</p>
                    <p className="text-2xl font-bold text-[#1E293B]">
                      {stats.totalDetails}
                    </p>
                  </div>
                  <div className="bg-[#F1F5F9] p-3 rounded-lg">
                    <FileText className="text-[#94A3B8]" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-[#FFFFFF] rounded-lg p-5 border border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#64748B] text-sm mb-1">Total Items</p>
                    <p className="text-2xl font-bold text-[#1E293B]">
                      {stats.totalItems}
                    </p>
                  </div>
                  <div className="bg-[#F1F5F9] p-3 rounded-lg">
                    <Box className="text-[#94A3B8]" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-[#FFFFFF] rounded-lg p-5 border border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#64748B] text-sm mb-1">Valor Total</p>
                    <p className="text-2xl font-bold text-[#1E293B]">
                      S/ {stats.totalValue}
                    </p>
                  </div>
                  <div className="bg-[#F1F5F9] p-3 rounded-lg">
                    <DollarSign className="text-[#94A3B8]" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-[#FFFFFF] rounded-lg p-5 border border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#64748B] text-sm mb-1">Compras</p>
                    <p className="text-2xl font-bold text-[#1E293B]">
                      {stats.uniqueShoppings}
                    </p>
                  </div>
                  <div className="bg-[#F1F5F9] p-3 rounded-lg">
                    <ShoppingCart className="text-[#94A3B8]" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros y Búsqueda */}
            <div className="bg-[#FFFFFF] rounded-lg p-5 border border-[#E2E8F0] mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Buscador */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8]"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Buscar por ID de compra, producto o cantidad..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent text-[#1E293B] placeholder-[#94A3B8]"
                    />
                  </div>
                </div>

                {/* Filtro por Compra */}
                <div>
                  <select
                    value={selectedShopping}
                    onChange={(e) => setSelectedShopping(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent text-[#1E293B] bg-[#FFFFFF]"
                  >
                    <option value="">Todas las compras</option>
                    {uniqueShoppings.map((id) => (
                      <option key={id} value={id}>
                        Compra #{id}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ordenar por */}
                <div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent text-[#1E293B] bg-[#FFFFFF]"
                  >
                    <option value="shopping_id">Ordenar por Compra</option>
                    <option value="product">Ordenar por Producto</option>
                    <option value="quantity">Ordenar por Cantidad</option>
                    <option value="price">Ordenar por Precio</option>
                  </select>
                </div>
              </div>

              {/* Botones de acción adicionales */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#E2E8F0]">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedShopping("");
                    setSortBy("shopping_id");
                    setSortOrder("desc");
                  }}
                  className="text-sm text-[#64748B] hover:text-[#1E293B] transition-colors"
                >
                  Limpiar filtros
                </button>
                <div className="flex-1"></div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "table"
                        ? "bg-[#CBD5E1] text-[#1E293B]"
                        : "bg-[#F1F5F9] text-[#94A3B8] hover:bg-[#E2E8F0]"
                    }`}
                    title="Vista tabla"
                  >
                    <List size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "cards"
                        ? "bg-[#CBD5E1] text-[#1E293B]"
                        : "bg-[#F1F5F9] text-[#94A3B8] hover:bg-[#E2E8F0]"
                    }`}
                    title="Vista tarjetas"
                  >
                    <Grid3x3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("grouped")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grouped"
                        ? "bg-[#CBD5E1] text-[#1E293B]"
                        : "bg-[#F1F5F9] text-[#94A3B8] hover:bg-[#E2E8F0]"
                    }`}
                    title="Vista agrupada"
                  >
                    <Layers size={18} />
                  </button>
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="p-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#94A3B8] rounded-lg transition-colors"
                    title={sortOrder === "asc" ? "Orden ascendente" : "Orden descendente"}
                  >
                    {sortOrder === "asc" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          {filteredDetails.length === 0 ? (
            <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] p-12 text-center">
              <FileText className="mx-auto text-[#CBD5E1] mb-4" size={64} />
              <h3 className="text-xl font-semibold text-[#1E293B] mb-2">
                No hay detalles registrados
              </h3>
              <p className="text-[#64748B]">
                {searchTerm || selectedShopping
                  ? "No se encontraron resultados con los filtros aplicados"
                  : "Aún no hay detalles de compras en el sistema"}
              </p>
            </div>
          ) : viewMode === "table" ? (
            /* Vista Tabla */
            <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                        <button
                          onClick={() => toggleSort("shopping_id")}
                          className="flex items-center gap-1 hover:text-[#1E293B]"
                        >
                          ID Compra
                          {sortBy === "shopping_id" && (
                            sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                        <button
                          onClick={() => toggleSort("product")}
                          className="flex items-center gap-1 hover:text-[#1E293B]"
                        >
                          ID Producto
                          {sortBy === "product" && (
                            sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                        <button
                          onClick={() => toggleSort("quantity")}
                          className="flex items-center gap-1 hover:text-[#1E293B] mx-auto"
                        >
                          Cantidad
                          {sortBy === "quantity" && (
                            sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                        <button
                          onClick={() => toggleSort("price")}
                          className="flex items-center gap-1 hover:text-[#1E293B] ml-auto"
                        >
                          Precio Unit.
                          {sortBy === "price" && (
                            sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {filteredDetails.map((detail) => (
                      <tr
                        key={detail.id}
                        className="hover:bg-[#F8FAFC] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <ShoppingCart size={16} className="text-[#94A3B8]" />
                            <span className="text-sm font-medium text-[#1E293B]">
                              #{detail.shopping_id}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Package size={16} className="text-[#94A3B8]" />
                            <span className="text-sm text-[#1E293B]">
                              Producto #{detail.product_id}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 bg-[#F1F5F9] px-3 py-1 rounded-full text-sm font-medium text-[#1E293B]">
                            <Hash size={14} className="text-[#94A3B8]" />
                            {Number(detail.quantity).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-medium text-[#1E293B]">
                            S/ {Number(detail.unit_price).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-semibold text-[#1E293B]">
                            S/ {Number(detail.subtotal).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : viewMode === "cards" ? (
            /* Vista Tarjetas */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDetails.map((detail) => (
                <div
                  key={detail.id}
                  className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] hover:shadow-md transition-all p-5"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#F1F5F9] p-2 rounded-lg">
                        <ShoppingCart className="text-[#94A3B8]" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B]">Compra</p>
                        <p className="text-sm font-semibold text-[#1E293B]">
                          #{detail.shopping_id}
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#F8FAFC] px-3 py-1 rounded-full">
                      <p className="text-xs font-medium text-[#64748B]">
                        ID: {detail.id}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg">
                      <Package className="text-[#94A3B8]" size={18} />
                      <div className="flex-1">
                        <p className="text-xs text-[#64748B]">Producto</p>
                        <p className="text-sm font-medium text-[#1E293B]">
                          ID: {detail.product_id}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-[#F8FAFC] rounded-lg">
                        <p className="text-xs text-[#64748B] mb-1">Cantidad</p>
                        <p className="text-lg font-bold text-[#1E293B]">
                          {Number(detail.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="p-3 bg-[#F8FAFC] rounded-lg">
                        <p className="text-xs text-[#64748B] mb-1">Precio Unit.</p>
                        <p className="text-lg font-bold text-[#1E293B]">
                          S/ {Number(detail.unit_price).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E2E8F0]">
                      <div className="flex justify-between items-center">
                        <span className="text-[#64748B] text-sm">Subtotal</span>
                        <span className="text-xl font-bold text-[#1E293B]">
                          S/ {Number(detail.subtotal).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Vista Agrupada por Compra */
            <div className="space-y-4">
              {Object.entries(groupedDetails).map(([shoppingId, items]) => {
                const isExpanded = expandedGroups[shoppingId];
                const groupTotal = items.reduce(
                  (sum, item) => sum + (parseFloat(item.subtotal) || 0),
                  0
                );
                const groupItems = items.reduce(
                  (sum, item) => sum + (parseFloat(item.quantity) || 0),
                  0
                );

                return (
                  <div
                    key={shoppingId}
                    className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] overflow-hidden"
                  >
                    {/* Header del grupo */}
                    <button
                      onClick={() => toggleGroup(shoppingId)}
                      className="w-full p-5 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-[#1E293B] p-3 rounded-lg">
                          <ShoppingCart className="text-white" size={24} />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-semibold text-[#1E293B]">
                            Compra #{shoppingId}
                          </h3>
                          <p className="text-sm text-[#64748B]">
                            {items.length} producto{items.length !== 1 ? "s" : ""} • {groupItems.toFixed(2)} items
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-[#64748B]">Total</p>
                          <p className="text-xl font-bold text-[#1E293B]">
                            S/ {groupTotal.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-[#F1F5F9] p-2 rounded-lg">
                          {isExpanded ? (
                            <ChevronUp size={20} className="text-[#94A3B8]" />
                          ) : (
                            <ChevronDown size={20} className="text-[#94A3B8]" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Contenido del grupo */}
                    {isExpanded && (
                      <div className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
                        <div className="p-5 space-y-3">
                          {items.map((detail) => (
                            <div
                              key={detail.id}
                              className="bg-[#FFFFFF] rounded-lg p-4 border border-[#E2E8F0] flex items-center justify-between hover:border-[#CBD5E1] transition-all"
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <div className="bg-[#F1F5F9] p-2 rounded-lg">
                                  <Package className="text-[#94A3B8]" size={20} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-[#1E293B]">
                                    Producto #{detail.product_id}
                                  </p>
                                  <p className="text-xs text-[#64748B]">
                                    ID Detalle: {detail.id}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-6">
                                <div className="text-center">
                                  <p className="text-xs text-[#64748B] mb-1">Cantidad</p>
                                  <p className="text-sm font-semibold text-[#1E293B]">
                                    {Number(detail.quantity).toFixed(2)}
                                  </p>
                                </div>
                                                              <div className="text-center">
                                  <p className="text-xs text-[#64748B] mb-1">Precio Unit.</p>
                                  <p className="text-sm font-semibold text-[#1E293B]">
                                    S/ {Number(detail.unit_price).toFixed(2)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-[#64748B] mb-1">Subtotal</p>
                                  <p className="text-sm font-bold text-[#1E293B]">
                                    S/ {Number(detail.subtotal).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
     </div>
    </div>
  );
};

export default ShoppingDetail;
