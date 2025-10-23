import React, { useEffect, useState } from "react";
import { Search, Download, DollarSign, Calendar, User, Filter, SortAsc, SortDesc, Receipt } from "lucide-react";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import { getCreditPayments } from "../../../api/creditPayments";
import Loading from "../../../components/common/Loading";


export default function CreditPayments() {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date"); // date, amount
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc
  const [dateFilter, setDateFilter] = useState("all"); // all, today, week, month

  useEffect(() => {
    async function fetchPayments() {
      try {
        const response = await getCreditPayments();
        setPayments(response);
        setFiltered(response);
      } catch (error) {
        console.error("Error al obtener los pagos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  useEffect(() => {
    let result = [...payments];

    // Aplicar búsqueda
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.id.toString().includes(query) ||
          p.credit_id.toString().includes(query) ||
          p.user?.name?.toLowerCase().includes(query) ||
          p.notes?.toLowerCase().includes(query)
      );
    }

    // Aplicar filtro de fecha
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      result = result.filter((p) => {
        const paymentDate = new Date(p.payment_date);
        
        switch (dateFilter) {
          case "today":
            return paymentDate >= today;
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return paymentDate >= weekAgo;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return paymentDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Aplicar ordenamiento
    result.sort((a, b) => {
      let aValue, bValue;

      if (sortBy === "amount") {
        aValue = parseFloat(a.amount) || 0;
        bValue = parseFloat(b.amount) || 0;
      } else {
        aValue = new Date(a.payment_date);
        bValue = new Date(b.payment_date);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFiltered(result);
  }, [search, payments, sortBy, sortOrder, dateFilter]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Calcular estadísticas
  const totalPagos = filtered.length;
  const montoTotal = filtered.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const promedioMonto = totalPagos > 0 ? montoTotal / totalPagos : 0;

  const handleExportExcel = () => {
    if (filtered.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    // 🔹 Encabezados
    const headers = [
      "ID Pago",
      "ID Crédito",
      "Monto (S/)",
      "Fecha de Pago",
      "Usuario",
      "Notas",
    ];

    // 🔹 Filas de datos
    const rows = filtered.map((pago) => [
      pago.id,
      pago.credit_id,
      parseFloat(pago.amount || 0),
      new Date(pago.payment_date).toLocaleString("es-PE"),
      pago.user?.name || pago.user_id || "",
      pago.notes || "",
    ]);

    // 🔹 Fila de totales
    const totalRow = ["", "TOTAL:", montoTotal, "", "", ""];

    // 🔹 Estructura de la hoja completa
    const worksheetData = [
      ["Reporte de Pagos de Créditos"],
      [`Fecha de exportación: ${new Date().toLocaleDateString("es-PE")}`],
      [`Total de pagos registrados: ${totalPagos}`],
      [],
      headers,
      ...rows,
      [],
      totalRow,
    ];

    // 🔹 Crear hoja
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // 🔹 Ajustar ancho de columnas
    worksheet["!cols"] = [
      { wch: 10 }, // ID Pago
      { wch: 12 }, // ID Crédito
      { wch: 15 }, // Monto
      { wch: 22 }, // Fecha de Pago
      { wch: 20 }, // Usuario
      { wch: 35 }, // Notas
    ];

    // 🔹 Crear libro
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pagos");

    // 🔹 Nombre del archivo
    const fileName = `Pagos_Creditos_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    // 🔹 Exportar archivo Excel
    XLSX.writeFile(workbook, fileName);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] lg:pt-0 pt-16">
      <div className="flex-1 p-8 ml-0 lg:ml-72 transition-all duration-300">
        <NavBarAdmin />

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Pagos de Créditos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Registro completo de pagos realizados
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Total Pagos</p>
                <p className="text-2xl font-semibold text-gray-800">{totalPagos}</p>
              </div>
              <Receipt className="text-gray-400" size={32} />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Monto Total</p>
                <p className="text-2xl font-semibold text-gray-800">
                  S/ {montoTotal.toFixed(2)}
                </p>
              </div>
              <DollarSign className="text-gray-400" size={32} />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Promedio</p>
                <p className="text-2xl font-semibold text-gray-800">
                  S/ {promedioMonto.toFixed(2)}
                </p>
              </div>
              <Calendar className="text-gray-400" size={32} />
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por ID, usuario o notas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-gray-300 focus:outline-none focus:border-transparent text-gray-800 bg-white transition-all"
              />
            </div>

            {/* Filtro por fecha */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400" size={18} />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gray-300 focus:outline-none focus:border-transparent text-gray-700 bg-white transition-all"
              >
                <option value="all">Todas las fechas</option>
                <option value="today">Hoy</option>
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
              </select>
            </div>

            {/* Ordenar por */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gray-300 focus:outline-none focus:border-transparent text-gray-700 bg-white transition-all"
              >
                <option value="date">Fecha</option>
                <option value="amount">Monto</option>
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

            {/* Exportar */}
            <button
              onClick={handleExportExcel}
              className="px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Download size={16} />
              Exportar
            </button>
          </div>

          {/* Contador */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Mostrando{" "}
              <span className="font-semibold text-gray-800">{filtered.length}</span> de{" "}
              <span className="font-semibold text-gray-800">{payments.length}</span>{" "}
              pagos
            </p>
          </div>
        </div>

        {/* Tabla */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Receipt className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">No hay pagos registrados</p>
            <p className="text-gray-400 text-sm mt-1">
              {search || dateFilter !== "all"
                ? "Intenta ajustar los filtros o la búsqueda"
                : "Los pagos aparecerán aquí cuando se registren"}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-700">
                      ID
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-700">
                      ID Crédito
                    </th>
                    <th className="py-3.5 px-4 text-right text-xs font-medium text-gray-700">
                      Monto
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-700">
                      Fecha de Pago
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-700">
                      Usuario
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-700">
                      Notas
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((pago) => (
                    <tr
                      key={pago.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-gray-700">{pago.id}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-gray-800">
                          #{pago.credit_id}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-gray-800">
                        S/ {parseFloat(pago.amount || 0).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700">
                        {new Date(pago.payment_date).toLocaleString("es-PE")}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          <span className="text-gray-700">
                            {pago.user?.name || pago.user_id || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 text-sm max-w-xs truncate">
                        {pago.notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td
                      colSpan={2}
                      className="py-4 px-4 text-right font-semibold text-gray-700"
                    >
                      TOTAL:
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-gray-800 text-base">
                      S/ {montoTotal.toFixed(2)}
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}