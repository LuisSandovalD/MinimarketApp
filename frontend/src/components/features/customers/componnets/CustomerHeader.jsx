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
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      {/* Título */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Gestión de Clientes</h2>
        <p className="text-gray-600">Administra tu cartera de clientes</p>
      </div>

      {/* Botones */}
      <div className="flex gap-3">

        {/* Alertas */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsPanel(!showAlertsPanel)}
            className="relative flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
          >
            <Bell size={20} />
            Alertas
            {overdueAlerts.length > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                {overdueAlerts.length}
              </span>
            )}
          </button>

          {/* Panel alertas */}
          <AnimatePresence>
            {showAlertsPanel && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-96 bg-white rounded-xl border border-gray-200 shadow-xl z-50 max-h-[500px] overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="text-red-500" size={20} />
                      <h3 className="font-bold text-gray-900">Alertas de Pagos</h3>
                    </div>
                    <button
                      onClick={() => setShowAlertsPanel(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
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

                {/* Lista o estado vacío */}
                <div className="overflow-y-auto flex-1">
                  {overdueAlerts.length === 0 ? (
                    <div className="p-8 text-center">
                      <CheckCircle className="mx-auto text-green-500 mb-3" size={48} />
                      <p className="text-gray-600 font-medium">No hay alertas pendientes</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Todos los pagos están al día
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {overdueAlerts.map((alert, index) => (
                        <motion.button
                          key={`${alert.creditId}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleAlertClick(alert)}
                          className={`w-full p-4 hover:bg-gray-50 transition-all text-left ${
                            alert.severity === "critical"
                              ? "bg-red-50 hover:bg-red-100 border-l-4 border-red-500"
                              : alert.severity === "high"
                              ? "bg-orange-50 hover:bg-orange-100 border-l-4 border-orange-500"
                              : "bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-500"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
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
                              <p className="text-sm text-gray-600 mt-1">
                                Venta #{alert.saleId}
                              </p>

                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">
                                  {alert.isOverdue
                                    ? `Vencido hace ${Math.abs(alert.daysUntilDue)} día${
                                        Math.abs(alert.daysUntilDue) !== 1 ? "s" : ""
                                      }`
                                    : `Vence en ${alert.daysUntilDue} día${
                                        alert.daysUntilDue !== 1 ? "s" : ""
                                      }`}
                                </span>

                                <span className="text-sm font-bold text-gray-900">
                                  S/ {alert.amount.toFixed(2)}
                                </span>
                              </div>

                              <p className="text-xs text-gray-500 mt-1">
                                Vencimiento:{" "}
                                {new Date(alert.dueDate).toLocaleDateString("es-PE")}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* total */}
                {overdueAlerts.length > 0 && (
                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <div className="text-xs text-gray-600 text-center">
                      <span className="font-semibold">Total pendiente:</span>{" "}
                      <span className="font-bold text-red-600">
                        S/{" "}
                        {overdueAlerts
                          .reduce((sum, a) => sum + a.amount, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Exportar */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
          >
            <Download size={20} />
            Exportar
          </button>

          <AnimatePresence>
            {showExportMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg z-10 overflow-hidden"
              >
                <button
                  onClick={exportToExcel}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-900"
                >
                  <FileText size={18} className="text-gray-600" />
                  <span className="font-medium">Exportar a CSV</span>
                </button>
                <button
                  onClick={exportToPDF}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-900"
                >
                  <FileText size={18} className="text-gray-600" />
                  <span className="font-medium">Exportar a PDF</span>
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
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
        >
          <UserPlus size={20} />
          Nuevo Cliente
        </button>

        <FullscreenButton className="shadow" />
      </div>
    </div>
  );
}
