import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  AlertTriangle,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  FileText,
  UserPlus
} from "lucide-react";
import { FullscreenButton } from "../../../common/buttons";

export default function CustomerHeader({
  showAlertsPanel,
  setShowAlertsPanel,
  overdueAlerts,
  handleAlertClick,
  showExportMenu,
  setShowExportMenu,
  exportToExcel,
  exportToPDF,
  setSelectedCustomer,
  setModalOpen
}) {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">

      
      {/* Título */}
      <div className="text-left w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          Gestión de Clientes
        </h2>
        <p className="text-gray-600">Administra tu cartera de clientes</p>
      </div>

      {/* Barra de acciones */}
      <div className="flex flex-wrap gap-3 justify-end w-full">

        {/* Exportar */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-4 h-11 md:h-12 
            bg-white hover:bg-gray-50 border border-gray-200 
            text-gray-900 rounded-xl font-semibold shadow-sm 
            hover:shadow-md transition-all"
          >
            <Download size={20} />
            <span className="hidden sm:inline">Exportar</span>
          </button>

          <AnimatePresence>
            {showExportMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute sm:left-0 left-1/2 -translate-x-1/2
                mt-2 w-48 bg-white rounded-xl border border-gray-200 
                shadow-lg z-20 overflow-hidden"
              >
                <button
                  onClick={exportToExcel}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-900"
                >
                  <FileText size={18} className="text-gray-600" />
                  <span>Exportar a CSV</span>
                </button>
                <button
                  onClick={exportToPDF}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-900"
                >
                  <FileText size={18} className="text-gray-600" />
                  <span>Exportar a PDF</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nuevo Cliente */}
        <button
          onClick={() => {
            setSelectedCustomer(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 h-11 md:h-12 
          bg-blue-600 hover:bg-blue-700 text-white 
          rounded-xl font-semibold shadow-sm hover:shadow-md"
        >
          <UserPlus size={20} />
          <span className="hidden lg:inline">Nuevo Cliente</span>
        </button>

        {/* Alertas */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsPanel(!showAlertsPanel)}
            className="relative flex items-center gap-2 px-4 h-11 md:h-12 
            bg-white hover:bg-gray-50 border border-gray-200 
            text-gray-900 rounded-xl font-semibold shadow-sm hover:shadow-md"
          >
            <Bell size={20} />

            {overdueAlerts.length > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center 
              w-5 h-5 md:w-6 md:h-6 bg-red-500 text-white text-xs 
              font-bold rounded-full animate-pulse">
                {overdueAlerts.length}
              </span>
            )}
          </button>

          {/* PANEL ALERTAS */}
          <AnimatePresence>
            {showAlertsPanel && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="
                  absolute mt-2 z-50 
                  w-[95vw] sm:w-96 
                  left-1/2 -translate-x-1/2 sm:right-0 sm:left-auto sm:translate-x-0
                  bg-white rounded-xl border border-gray-200 shadow-xl 
                  max-h-[500px] overflow-hidden flex flex-col
                "

              >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="text-red-500" size={20} />
                      <h3 className="font-bold text-gray-900">Alertas de Pagos</h3>
                    </div>
                    <button
                      onClick={() => setShowAlertsPanel(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {overdueAlerts.length} crédito
                    {overdueAlerts.length !== 1 ? "s" : ""} requiere
                    {overdueAlerts.length === 1 ? "" : "n"} atención
                  </p>
                </div>

                {/* Lista */}
                <div className="overflow-y-auto flex-1">
                  {overdueAlerts.length === 0 ? (
                    <div className="p-8 text-center">
                      <CheckCircle className="mx-auto text-green-500 mb-3" size={48} />
                      <p className="text-gray-600 font-medium">No hay alertas pendientes</p>
                      <p className="text-xs text-gray-500">Todos los pagos están al día</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {overdueAlerts.map((alert, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleAlertClick(alert)}
                          className={`
                            w-full p-4 text-left transition-all
                            ${
                              alert.severity === "critical"
                                ? "bg-red-50 hover:bg-red-100 border-l-4 border-red-500"
                                : alert.severity === "high"
                                ? "bg-orange-50 hover:bg-orange-100 border-l-4 border-orange-500"
                                : "bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-500"
                            }
                          `}
                        >
                          <div className="flex flex-col gap-1">
                            <div>
                              {alert.isOverdue ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                  <AlertCircle size={12} />
                                  VENCIDO
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                                  <Clock size={12} />
                                  POR VENCER
                                </span>
                              )}
                            </div>

                            <p className="font-semibold text-gray-900 truncate">
                              {alert.customerName}
                            </p>

                            <p className="text-sm text-gray-600">Venta #{alert.saleId}</p>

                            <div className="flex justify-between text-sm">
                              <span className="text-xs text-gray-500">
                                {alert.isOverdue
                                  ? `Vencido hace ${Math.abs(alert.daysUntilDue)} día${
                                      Math.abs(alert.daysUntilDue) !== 1 ? "s" : ""
                                    }`
                                  : `Vence en ${alert.daysUntilDue} día${
                                      alert.daysUntilDue !== 1 ? "s" : ""
                                    }`}
                              </span>

                              <span className="font-bold text-gray-900">
                                S/ {alert.amount.toFixed(2)}
                              </span>
                            </div>

                            <p className="text-xs text-gray-500">
                              Vencimiento:{" "}
                              {new Date(alert.dueDate).toLocaleDateString("es-PE")}
                            </p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total */}
                {overdueAlerts.length > 0 && (
                  <div className="p-3 border-t border-gray-200 bg-gray-50 text-center text-xs">
                    <span className="font-semibold">Total pendiente: </span>
                    <span className="font-bold text-red-600">
                      S/ {overdueAlerts.reduce((sum, a) => sum + a.amount, 0).toFixed(2)}
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <FullscreenButton className="h-11 md:h-12 shadow" />
      </div>
    </div>
  );
}
