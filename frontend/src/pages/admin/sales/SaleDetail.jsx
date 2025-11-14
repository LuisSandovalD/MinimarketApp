import { useEffect, useState, useMemo } from "react";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import { getSalesDetail } from "@/api";
import Loading from "@/components/common/loaders/AppLoading";
import Pagination from "@/components/common/Pagination";
import { Download, FileText, Filter, Search, X } from "lucide-react";

export default function SaleDetail() {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [saleFilter, setSaleFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSalesDetail();
        setDetails(data);
      } catch (error) {
        console.error("Error al cargar detalles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Datos filtrados
  const filteredDetails = useMemo(() => {
    return details.filter(detail => {
      const matchesSearch = searchTerm === "" || 
        detail.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail.product?.code?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === "" || 
        detail.product?.category === categoryFilter;
      
      const matchesSale = saleFilter === "" || 
        detail.sale?.id?.toString() === saleFilter;
      
      return matchesSearch && matchesCategory && matchesSale;
    });
  }, [details, searchTerm, categoryFilter, saleFilter]);

  // Cálculo de paginación
  const totalPages = Math.ceil(filteredDetails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDetails = filteredDetails.slice(startIndex, endIndex);

  const totalGeneral = filteredDetails.reduce(
    (sum, d) => sum + parseFloat(d.subtotal || 0),
    0
  );

  // Obtener categorías y ventas únicas
  const categories = useMemo(() => {
    return [...new Set(details.map(d => d.product?.category).filter(Boolean))];
  }, [details]);

  const sales = useMemo(() => {
    return [...new Set(details.map(d => d.sale?.id).filter(Boolean))].sort((a, b) => a - b);
  }, [details]);

  // Funciones de paginación
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const changeItemsPerPage = (items) => {
    setItemsPerPage(Number(items));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // Objeto de paginación para el componente Pagination
  const pagination = {
    currentPage,
    totalPages,
    totalItems: filteredDetails.length,
    itemsPerPage,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, filteredDetails.length)
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setSaleFilter("");
    setCurrentPage(1);
  };

  // Exportar a PDF (formato texto)
  const exportToPDF = () => {
    const content = `DETALLES DE VENTAS
Fecha de generación: ${new Date().toLocaleString('es-PE')}
Total de registros: ${filteredDetails.length}
Total general: S/ ${totalGeneral.toFixed(2)}

${'='.repeat(100)}

${filteredDetails.map((d, i) => `
${i + 1}. VENTA #${d.sale?.id || '—'}
   Producto: ${d.product?.name || 'N/A'}
   Código: ${d.product?.code || 'N/A'}
   Categoría: ${d.product?.category || '—'}
   Cantidad: ${d.quantity}
   Precio Unitario: S/ ${parseFloat(d.unit_price).toFixed(2)}
   Subtotal: S/ ${parseFloat(d.subtotal).toFixed(2)}
${'-'.repeat(100)}`).join('\n')}

${'='.repeat(100)}
TOTAL GENERAL: S/ ${totalGeneral.toFixed(2)}
${'='.repeat(100)}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `detalles-ventas-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Exportar a Excel (CSV)
  const exportToExcel = () => {
    const headers = ['N°', 'Venta ID', 'Producto', 'Código', 'Categoría', 'Cantidad', 'Precio Unitario', 'Subtotal'];
    
    const rows = filteredDetails.map((d, i) => [
      i + 1,
      d.sale?.id || '—',
      d.product?.name || 'N/A',
      d.product?.code || 'N/A',
      d.product?.category || '—',
      d.quantity,
      parseFloat(d.unit_price).toFixed(2),
      parseFloat(d.subtotal).toFixed(2)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => {
        const cellStr = String(cell);
        return cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n') 
          ? `"${cellStr.replace(/"/g, '""')}"` 
          : cellStr;
      }).join(',')),
      '',
      `,,,,,,"TOTAL GENERAL:",${totalGeneral.toFixed(2)}`
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `detalles-ventas-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] lg:pt-0">
      <div className="flex-1 lg:ml-72 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8">
        <NavBarAdmin />
        
        <div className="mt-6 flex-1">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Detalles de Ventas
            </h1>
            <p className="text-sm text-gray-600">
              {filteredDetails.length} registro{filteredDetails.length !== 1 ? 's' : ''} encontrado{filteredDetails.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Barra de acciones y filtros */}
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
                    setCurrentPage(1);
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
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filtros</span>
                </button>
                <button
                  onClick={exportToPDF}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                  title="Exportar a PDF"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
                <button
                  onClick={exportToExcel}
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
              <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Categoría
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="">Todas las categorías</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
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
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="">Todas las ventas</option>
                      {sales.map(sale => (
                        <option key={sale} value={sale}>Venta #{sale}</option>
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

          {/* Tabla */}
          {filteredDetails.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-500">
                {searchTerm || categoryFilter || saleFilter 
                  ? 'No se encontraron detalles con los filtros aplicados.' 
                  : 'No hay detalles registrados.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-700 text-xs font-medium">
                      <tr>
                        <th className="px-4 py-3.5 border-b border-gray-200">#</th>
                        <th className="px-4 py-3.5 border-b border-gray-200">Venta</th>
                        <th className="px-4 py-3.5 border-b border-gray-200">Producto</th>
                        <th className="px-4 py-3.5 border-b border-gray-200 text-center">Cantidad</th>
                        <th className="px-4 py-3.5 border-b border-gray-200 text-center">Precio Unit.</th>
                        <th className="px-4 py-3.5 border-b border-gray-200 text-center">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDetails.map((detail, index) => (
                        <tr
                          key={detail.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3.5 text-gray-600">
                            {startIndex + index + 1}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-medium text-gray-800">
                              #{detail.sale?.id || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            {detail.product?.name ? (
                              <>
                                <span className="font-medium text-gray-800 block">
                                  {detail.product.name}
                                </span>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {detail.product.code} • {detail.product.category || "—"}
                                </p>
                              </>
                            ) : (
                              <span className="text-gray-500">
                                Producto ID: {detail.product_id}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-center text-gray-700">
                            {detail.quantity}
                          </td>
                          <td className="px-4 py-3.5 text-center text-gray-700">
                            S/ {parseFloat(detail.unit_price).toFixed(2)}
                          </td>
                          <td className="px-4 py-3.5 text-center font-semibold text-gray-800">
                            S/ {parseFloat(detail.subtotal).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100 border-t-2 border-gray-300">
                        <td colSpan={5} className="px-4 py-4 text-right font-semibold text-gray-700">
                          TOTAL GENERAL:
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-gray-800 text-base">
                          S/ {totalGeneral.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Paginación */}
              <Pagination
                pagination={pagination}
                goToPage={goToPage}
                changeItemsPerPage={changeItemsPerPage}
                getPageNumbers={getPageNumbers}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}