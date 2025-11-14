import { useEffect, useState } from "react";
import { X, CreditCard, DollarSign, Calendar, Download, Check, AlertCircle, Filter } from "lucide-react";
import {
    getCredits,
    updateMultipleCredits,
} from "@/api";
import WhatsAppButton from "../../components/common/buttons/WhatsAppButton";
import * as XLSX from "xlsx";

// Función auxiliar para obtener la fecha de hoy sin tiempo
const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

// Función auxiliar para formatear una fecha a YYYY-MM-DD para el input[type="date"]
const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
};

// Función auxiliar para calcular el último día del mes (útil para "Fin de Mes")
const getLastDayOfMonth = (date) => {
    const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    d.setHours(23, 59, 59, 999);
    return d;
};


export default function CreditsFormModal({ isOpen, onClose, customer }) {
    const [credits, setCredits] = useState([]);
    const [selectedCredits, setSelectedCredits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showPaidCredits, setShowPaidCredits] = useState(false);
    const [startDateFilter, setStartDateFilter] = useState(""); // YYYY-MM-DD
    const [endDateFilter, setEndDateFilter] = useState(""); // YYYY-MM-DD

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
            setStartDateFilter("");
            setEndDateFilter("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // --- Lógica de Filtrado de Créditos ---
    const applyDateFilter = (credit) => {
        const dueDate = new Date(credit.due_date);
        dueDate.setHours(0, 0, 0, 0); // Normalizar a medianoche

        let passesStart = true;
        if (startDateFilter) {
            const start = new Date(startDateFilter);
            start.setHours(0, 0, 0, 0);
            passesStart = dueDate >= start;
        }

        let passesEnd = true;
        if (endDateFilter) {
            // Para incluir el día final, buscamos hasta el final del día
            const end = new Date(endDateFilter);
            end.setHours(23, 59, 59, 999); 
            passesEnd = dueDate <= end;
        }

        return passesStart && passesEnd;
    };


    // Filtrar créditos según la vista y el rango de fechas
    const allFilteredCredits = credits.filter(applyDateFilter);
    
    const pendingCredits = allFilteredCredits.filter((c) => c.status === "pendiente");
    const paidCredits = allFilteredCredits.filter((c) => c.status === "pagado");
    
    const displayedCredits = showPaidCredits 
        ? allFilteredCredits 
        : pendingCredits;

    // --- Lógica para rangos preestablecidos ---
    const handleDateRangeSelect = (type) => {
        const today = getToday();
        let start = today;
        let end = new Date(today);
        
        switch (type) {
            case "week":
                end.setDate(today.getDate() + 7);
                break;
            case "fortnight": // Quincena
                end.setDate(today.getDate() + 15);
                break;
            case "month_end":
                start = today;
                end = getLastDayOfMonth(today);
                break;
            default:
                setStartDateFilter("");
                setEndDateFilter("");
                return;
        }

        // Normalizar fechas para el filtro: start al inicio del día, end al final
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        setStartDateFilter(formatDateForInput(start));
        setEndDateFilter(formatDateForInput(end));

        // Desseleccionar créditos al cambiar el filtro
        setSelectedCredits([]); 
    };
    
    // --- Cálculos de Totales (aplicados solo a los *pendientes* y *filtrados*) ---
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

    // --- Handlers de Selección y Pago (mantienen la lógica original) ---

    const handleSelectCredit = (id) => {
        setSelectedCredits((prev) =>
            prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        // Solo selecciona los que están en la vista actual (pendientes y filtrados)
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

        if (!window.confirm(`¿Deseas marcar todos los ${pendingCredits.length} créditos pendientes (filtrados) como pagados?`)) {
            return;
        }

        setUpdating(true);
        try {
            // Paga solo los créditos pendientes que están actualmente filtrados.
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

    // --- Handler de Exportación a Excel (mantiene la lógica original, usa 'displayedCredits') ---

    const handleExportExcel = () => {
        const dataToExport = displayedCredits; // Exporta lo que está actualmente en la tabla.

        if (dataToExport.length === 0) {
            alert("No hay datos para exportar");
            return;
        }

        // ... (rest of export logic remains the same, using totalBase, totalInterest, totalWithInterest) ...
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

        // Agregar fila de totales (solo si se muestran pendientes)
        let totalRow = null;
        if (!showPaidCredits && pendingCredits.length > 0) {
            totalRow = [
                "",
                "TOTAL:",
                totalBase,
                "",
                totalInterest,
                totalWithInterest,
                "",
                "",
            ];
        }

        // Combinar todo
        const worksheetData = [
            [`Estado de Cuenta - ${customer.name}`],
            [`Filtro: ${startDateFilter ? startDateFilter : 'Inicio'} - ${endDateFilter ? endDateFilter : 'Fin'}`],
            [`Fecha de exportación: ${new Date().toLocaleDateString("es-PE")}`],
            [],
            headers,
            ...rows,
            [],
        ];

        if (totalRow) {
            worksheetData.push(totalRow);
        }

        // Crear hoja de trabajo
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // Ajustar anchos de columnas
        worksheet["!cols"] = [
            { wch: 6 },  // ID
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


    // 🛑 DEFINE LAS VARIABLES AQUÍ (ANTES DEL RETURN) 🛑
    // ---------------------------------------------------
    const customerName = customer?.name || "Cliente";
    // Asume que el número de teléfono está en `customer.phone` y necesita el código de país (ej: 51987654321)
    const customerPhone = customer?.phone || ""; 
    
    const pendingCount = pendingCredits.length; 
    const totalDueFormatted = totalWithInterest.toFixed(2);
    
    // Construye el mensaje dinámico
    const defaultMessage = 
        pendingCount === 0 
        ? `Hola ${customerName}, te escribimos para confirmar que actualmente no tienes créditos pendientes de pago. ¡Gracias por tu puntualidad! 😊`
        : `¡Hola ${customerName}! 👋 
        Te recordamos amablemente que tienes ${pendingCount} crédito(s) pendiente(s) de pago por un total de S/ ${totalDueFormatted}. 
        Por favor, regulariza tu situación a la brevedad.`;
    // ---------------------------------------------------


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
                
                {/* 📍 BOTÓN DE WHATSAPP DEFINIDO CORRECTAMENTE 📍 */}
                <div className="p-6 pt-4 border-b border-gray-100">
                    <WhatsAppButton 
                        phoneNumber={customerPhone}
                        message={defaultMessage}
                        customerName={customerName}
                    />
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* ... (el resto del contenido sigue igual) ... */}
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
                                    <p className="text-xs text-gray-600 font-medium mb-1">Pendientes (Filtrados)</p>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        {pendingCredits.length}
                                    </p>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                                    <p className="text-xs text-gray-600 font-medium mb-1">Total Base (Filtrado)</p>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        S/ {totalBase.toFixed(2)}
                                    </p>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                                    <p className="text-xs text-gray-600 font-medium mb-1">Interés (Filtrado)</p>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        S/ {totalInterest.toFixed(2)}
                                    </p>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                                    <p className="text-xs text-gray-600 font-medium mb-1">Total a Pagar (Filtrado)</p>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        S/ {totalWithInterest.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-6">

                                {/* --- FILTRO DE FECHAS --- */}
                                <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><Filter size={16} /> Filtrar por Vencimiento</h3>
                                    
                                    {/* Controles Preestablecidos */}
                                    <div className="flex flex-wrap items-center gap-2 mb-4">
                                        <span className="text-xs text-gray-600 font-medium mr-1">Rango Rápido:</span>
                                        {["week", "fortnight", "month_end"].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => handleDateRangeSelect(type)}
                                                className="px-3 py-1 text-xs rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                {type === "week" ? "Próxima Semana" : type === "fortnight" ? "Próxima Quincena" : "Fin de Mes"}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => handleDateRangeSelect("clear")}
                                            className="px-3 py-1 text-xs rounded-lg border border-red-300 bg-white text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            Limpiar
                                        </button>
                                    </div>

                                    {/* Rango Manual */}
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <label htmlFor="start-date" className="text-sm text-gray-600">Desde:</label>
                                            <input
                                                id="start-date"
                                                type="date"
                                                value={startDateFilter}
                                                onChange={(e) => {
                                                    setStartDateFilter(e.target.value);
                                                    setSelectedCredits([]);
                                                }}
                                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-gray-500 focus:border-gray-500"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label htmlFor="end-date" className="text-sm text-gray-600">Hasta:</label>
                                            <input
                                                id="end-date"
                                                type="date"
                                                value={endDateFilter}
                                                onChange={(e) => {
                                                    setEndDateFilter(e.target.value);
                                                    setSelectedCredits([]);
                                                }}
                                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-gray-500 focus:border-gray-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Controles de Vista y Exportación */}
                                <div className="flex flex-wrap items-center justify-between gap-3">
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
                                                        {showPaidCredits 
                                                            ? "No hay créditos en el rango seleccionado" 
                                                            : "No hay créditos pendientes en el rango seleccionado"
                                                        }
                                                    </td>
                                                </tr>
                                            ) : (
                                                displayedCredits.map((credit) => {
                                                    const isOverdue = new Date(credit.due_date) < getToday() && credit.status === "pendiente";
                                                    
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