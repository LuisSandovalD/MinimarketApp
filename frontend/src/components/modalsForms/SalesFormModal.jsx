import { useEffect, useState } from "react";
import { X, ShoppingCart, Download, Calendar, DollarSign, FileText, TrendingUp } from "lucide-react";
import { getSales } from "@/api";
import * as XLSX from "xlsx";


export default function SalesFormModal({ isOpen, onClose, customer }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date"); // date, total
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc

  const fetchSales = async () => {
    setLoading(true);
    try {
      const data = await getSales();
      // Filtrar solo las ventas del cliente seleccionado
      const customerSales = data.filter((sale) => sale.customer_id === customer.id);
      setSales(customerSales);
    } catch (error) {
      console.error("Error al cargar ventas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && customer) {
      fetchSales();
    }
  }, [isOpen, customer]);

  if (!isOpen) return null;

  // Ordenar ventas
  const sortedSales = [...sales].sort((a, b) => {
    let aValue, bValue;

    if (sortBy === "total") {
      aValue = parseFloat(a.total) || 0;
      bValue = parseFloat(b.total) || 0;
    } else {
      aValue = new Date(a.date || a.created_at);
      bValue = new Date(b.date || b.created_at);
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Calcular estadísticas
  const totalVentas = sales.length;
  const montoTotal = sales.reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0);
  const promedioVenta = totalVentas > 0 ? montoTotal / totalVentas : 0;
  const mayorVenta = sales.length > 0 ? Math.max(...sales.map(s => parseFloat(s.total || 0))) : 0;

  const handleExportExcel = () => {
    if (sales.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    // Crear encabezados
    const headers = [
      "ID Venta",
      "Número de Venta",
      "Fecha",
      "Subtotal (S/)",
      "IGV (S/)",
      "Total (S/)",
      "Método de Pago",
      "Notas",
    ];

    // Crear filas de datos
    const rows = sortedSales.map((sale) => [
      sale.id,
      sale.sale_number || "",
      sale.date ? new Date(sale.date).toLocaleDateString("es-PE") : "",
      parseFloat(sale.subtotal || 0),
      parseFloat(sale.vat || 0),
      parseFloat(sale.total || 0),
      sale.payment_method?.name || "",
      sale.notes || "",
    ]);

    // Calcular totales
    const totalSubtotal = sales.reduce((sum, s) => sum + parseFloat(s.subtotal || 0), 0);
    const totalIgv = sales.reduce((sum, s) => sum + parseFloat(s.vat || 0), 0);
    const totalGeneral = montoTotal;

    // Fila de totales
    const totalRow = [
      "",
      "",
      "TOTALES:",
      totalSubtotal,
      totalIgv,
      totalGeneral,
      "",
      "",
    ];

    // Estructura general de la hoja
    const worksheetData = [
      [`Historial de Compras - ${customer.name}`],
      [`Fecha de exportación: ${new Date().toLocaleDateString("es-PE")}`],
      [`Total de ventas: ${totalVentas}`],
      [],
      headers,
      ...rows,
      [],
      totalRow,
    ];

    // Crear hoja de trabajo
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Ajustar ancho de columnas
    worksheet["!cols"] = [
      { wch: 8 },  // ID Venta
      { wch: 15 }, // Número de Venta
      { wch: 15 }, // Fecha
      { wch: 15 }, // Subtotal
      { wch: 12 }, // IGV
      { wch: 15 }, // Total
      { wch: 20 }, // Método de Pago
      { wch: 30 }, // Notas
    ];

    // Crear libro de Excel
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");

    // Nombre del archivo
    const fileName = `Ventas_${customer.name.replace(/\s+/g, "_")}_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    // Exportar archivo Excel
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-gray-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Historial de Compras
              </h2>
              <p className="text-sm text-gray-500">{customer.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
            </div>
          ) : sales.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 font-medium">
                Este cliente no tiene ventas registradas
              </p>
            </div>
          ) : (
            <>
              {/* Estadísticas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={16} className="text-gray-500" />
                    <p className="text-xs text-gray-600 font-medium">Total Ventas</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-800">{totalVentas}</p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign size={16} className="text-gray-500" />
                    <p className="text-xs text-gray-600 font-medium">Monto Total</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-800">
                    S/ {montoTotal.toFixed(2)}
                  </p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={16} className="text-gray-500" />
                    <p className="text-xs text-gray-600 font-medium">Promedio</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-800">
                    S/ {promedioVenta.toFixed(2)}
                  </p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={16} className="text-gray-500" />
                    <p className="text-xs text-gray-600 font-medium">Mayor Venta</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-800">
                    S/ {mayorVenta.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Controles */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600 font-medium">Ordenar por:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-300 focus:outline-none focus:border-transparent bg-white transition-all"
                  >
                    <option value="date">Fecha</option>
                    <option value="total">Monto</option>
                  </select>

                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-all"
                  >
                    {sortOrder === "asc" ? "↑ Ascendente" : "↓ Descendente"}
                  </button>
                </div>

                <button
                  onClick={handleExportExcel}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 transition-all flex items-center gap-2"
                >
                  <Download size={16} />
                  Exportar Excel
                </button>
              </div>

              {/* Tabla */}
              <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl">
                <table className="min-w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700">
                        ID
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700">
                        N° Venta
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700">
                        Fecha
                      </th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-700">
                        Subtotal
                      </th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-700">
                        IGV
                      </th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-700">
                        Total
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700">
                        Método de Pago
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700">
                        Notas
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSales.map((sale) => (
                      <tr
                        key={sale.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-700">{sale.id}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-800">
                            {sale.sale_number || "—"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {sale.date
                            ? new Date(sale.date).toLocaleDateString("es-PE")
                            : "—"}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-700">
                          S/ {parseFloat(sale.subtotal || 0).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-700">
                          S/ {parseFloat(sale.vat || 0).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-800">
                          S/ {parseFloat(sale.total || 0).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {sale.payment_method?.name || "—"}
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm max-w-xs truncate">
                          {sale.notes || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                    <tr>
                      <td
                        colSpan={3}
                        className="py-4 px-4 text-right font-semibold text-gray-700"
                      >
                        TOTALES:
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-800">
                        S/{" "}
                        {sales
                          .reduce((sum, s) => sum + parseFloat(s.subtotal || 0), 0)
                          .toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-800">
                        S/{" "}
                        {sales
                          .reduce((sum, s) => sum + parseFloat(s.vat || 0), 0)
                          .toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-gray-800 text-base">
                        S/ {montoTotal.toFixed(2)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}