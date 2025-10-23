import { useEffect, useState } from "react";
import { X, CreditCard, DollarSign, Calendar, Download, Check, AlertCircle } from "lucide-react";
import {
  getCredits,
  updateMultipleCredits,
} from "../../api/credit";
import * as XLSX from "xlsx";


export default function ModalCustomerCredits({ isOpen, onClose, customer }) {
  const [credits, setCredits] = useState([]);
  const [selectedCredits, setSelectedCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPaidCredits, setShowPaidCredits] = useState(false);

  const loadCredits = async () => {
    try {
      const data = await getCredits();
      const filtered = data.filter((c) => c.sale?.customer?.id === customer.id);
      setCredits(filtered);
    } catch (error) {
      console.error("Error al cargar créditos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCredits();
      setSelectedCredits([]);
      setShowPaidCredits(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtrar créditos según la vista
  const displayedCredits = showPaidCredits 
    ? credits 
    : credits.filter((c) => c.status === "pendiente");

  const pendingCredits = credits.filter((c) => c.status === "pendiente");
  const paidCredits = credits.filter((c) => c.status === "pagado");
  
  const totalBase = pendingCredits.reduce(
    (sum, c) => sum + parseFloat(c.total_amount || 0),
    0
  );
  const totalInterest = pendingCredits.reduce(
    (sum, c) => sum + parseFloat(c.interest_amount || 0),
    0
  );
  const totalWithInterest = pendingCredits.reduce(
    (sum, c) => sum + parseFloat(c.total_with_interest || 0),
    0
  );

  const handleSelectCredit = (id) => {
    setSelectedCredits((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCredits.length === pendingCredits.length) {
      setSelectedCredits([]);
    } else {
      setSelectedCredits(pendingCredits.map((c) => c.id));
    }
  };

  const handlePaySelected = async () => {
    if (selectedCredits.length === 0) {
      alert("Selecciona al menos un crédito.");
      return;
    }

    if (!window.confirm(`¿Deseas marcar como pagados ${selectedCredits.length} crédito(s) seleccionado(s)?`)) {
      return;
    }

    setUpdating(true);
    try {
      await updateMultipleCredits({ ids: selectedCredits, status: "pagado" });
      await loadCredits();
      setSelectedCredits([]);
      alert("Créditos actualizados correctamente");
    } catch (error) {
      console.error("Error al actualizar créditos:", error);
      alert("Error al actualizar créditos");
    } finally {
      setUpdating(false);
    }
  };

  const handlePayAll = async () => {
    if (pendingCredits.length === 0) {
      alert("No hay créditos pendientes para pagar.");
      return;
    }

    if (!window.confirm(`¿Deseas marcar todos los ${pendingCredits.length} créditos pendientes como pagados?`)) {
      return;
    }

    setUpdating(true);
    try {
      const ids = pendingCredits.map((c) => c.id);
      await updateMultipleCredits({ ids, status: "pagado" });
      await loadCredits();
      setSelectedCredits([]);
      alert("Todos los créditos fueron pagados");
    } catch (error) {
      console.error("Error al actualizar créditos:", error);
      alert("Error al pagar créditos");
    } finally {
      setUpdating(false);
    }
  };

  const handleExportExcel = () => {
    const dataToExport = showPaidCredits ? credits : pendingCredits;

    if (dataToExport.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    // Crear encabezados
    const headers = [
      "ID",
      "Venta",
      "Monto Base (S/)",
      "Tasa Interés (%)",
      "Monto Interés (S/)",
      "Total con Interés (S/)",
      "Fecha Vencimiento",
      "Estado",
    ];

    // Crear filas con datos
    const rows = dataToExport.map((credit) => [
      credit.id,
      `#${credit.sale_id}`,
      parseFloat(credit.total_amount || 0),
      parseFloat(credit.interest_rate || 0),
      parseFloat(credit.interest_amount || 0),
      parseFloat(credit.total_with_interest || 0),
      new Date(credit.due_date).toLocaleDateString("es-PE"),
      credit.status,
    ]);

    // Agregar fila de totales
    const totalRow = [
      "",
      "TOTAL:",
      totalBase,
      "",
      totalInterest,
      totalWithInterest,
      "",
      "",
    ];

    // Combinar todo
    const worksheetData = [
      [`Estado de Cuenta - ${customer.name}`],
      [`Fecha de exportación: ${new Date().toLocaleDateString("es-PE")}`],
      [],
      headers,
      ...rows,
      [],
      totalRow,
    ];

    // Crear hoja de trabajo
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Ajustar anchos de columnas
    worksheet["!cols"] = [
      { wch: 6 },  // ID
      { wch: 10 }, // Venta
      { wch: 15 }, // Monto Base
      { wch: 15 }, // Tasa Interés
      { wch: 15 }, // Monto Interés
      { wch: 18 }, // Total con Interés
      { wch: 18 }, // Fecha
      { wch: 12 }, // Estado
    ];

    // Crear libro de Excel
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Créditos");

    // Descargar archivo
    const fileName = `Creditos_${customer.name.replace(/\s+/g, "_")}_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <CreditCard className="text-gray-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Estado de Cuenta
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
          ) : credits.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 font-medium">No tiene créditos registrados</p>
            </div>
          ) : (
            <>
              {/* Estadísticas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                  <p className="text-xs text-gray-600 font-medium mb-1">Pendientes</p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {pendingCredits.length}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                  <p className="text-xs text-gray-600 font-medium mb-1">Total Base</p>
                  <p className="text-2xl font-semibold text-gray-800">
                    S/ {totalBase.toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                  <p className="text-xs text-gray-600 font-medium mb-1">Interés</p>
                  <p className="text-2xl font-semibold text-gray-800">
                    S/ {totalInterest.toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                  <p className="text-xs text-gray-600 font-medium mb-1">Total a Pagar</p>
                  <p className="text-2xl font-semibold text-gray-800">
                    S/ {totalWithInterest.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Controles */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPaidCredits(!showPaidCredits)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      showPaidCredits
                        ? "bg-gray-800 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {showPaidCredits ? "Ver solo pendientes" : "Ver todos"}
                  </button>
                  
                  {pendingCredits.length > 0 && !showPaidCredits && (
                    <button
                      onClick={handleSelectAll}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      {selectedCredits.length === pendingCredits.length
                        ? "Deseleccionar todos"
                        : "Seleccionar todos"}
                    </button>
                  )}
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
                      {!showPaidCredits && (
                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-700">
                          ✓
                        </th>
                      )}
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700">ID</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700">Venta</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700">Monto Base</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700">Interés (%)</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700">Total + Interés</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700">Vencimiento</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedCredits.length === 0 ? (
                      <tr>
                        <td colSpan={showPaidCredits ? 7 : 8} className="py-8 text-center text-gray-500">
                          No hay créditos {showPaidCredits ? "" : "pendientes"}
                        </td>
                      </tr>
                    ) : (
                      displayedCredits.map((credit) => {
                        const isOverdue = new Date(credit.due_date) < new Date() && credit.status === "pendiente";
                        
                        return (
                          <tr 
                            key={credit.id} 
                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                              isOverdue ? "bg-red-50" : ""
                            }`}
                          >
                            {!showPaidCredits && (
                              <td className="py-3 px-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedCredits.includes(credit.id)}
                                  disabled={credit.status !== "pendiente"}
                                  onChange={() => handleSelectCredit(credit.id)}
                                  className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-2 focus:ring-gray-300"
                                />
                              </td>
                            )}
                            <td className="py-3 px-4 text-gray-700">{credit.id}</td>
                            <td className="py-3 px-4">
                              <span className="font-medium text-gray-800">#{credit.sale_id}</span>
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              S/ {parseFloat(credit.total_amount ?? 0).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              {parseFloat(credit.interest_rate ?? 0).toFixed(2)}%
                            </td>
                            <td className="py-3 px-4 font-semibold text-gray-800">
                              S/ {parseFloat(credit.total_with_interest ?? 0).toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`text-sm ${isOverdue ? "text-red-600 font-semibold" : "text-gray-700"}`}>
                                {new Date(credit.due_date).toLocaleDateString("es-PE")}
                                {isOverdue && " ⚠️"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`text-xs px-2.5 py-1 rounded-full font-medium inline-block ${
                                  credit.status === "pendiente"
                                    ? "bg-gray-100 text-gray-700 border border-gray-300"
                                    : credit.status === "pagado"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-600 border border-red-200"
                                }`}
                              >
                                {credit.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && credits.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50 flex flex-wrap justify-between items-center gap-3">
            <div className="flex gap-3">
              <button
                onClick={handlePaySelected}
                disabled={updating || selectedCredits.length === 0}
                className="px-5 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Pagar seleccionados ({selectedCredits.length})
                  </>
                )}
              </button>
              
              {pendingCredits.length > 0 && (
                <button
                  onClick={handlePayAll}
                  disabled={updating}
                  className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? "Procesando..." : `Pagar todos (${pendingCredits.length})`}
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}