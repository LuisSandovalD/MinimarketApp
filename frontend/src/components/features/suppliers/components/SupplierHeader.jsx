import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Plus, FileText } from "lucide-react";
import FullscreenButton from "../../../common/buttons/FullscreenButton";
export const SupplierHeader = ({
  onNewSupplier,
  showExportMenu,
  setShowExportMenu,
  onExportCSV,
  onExportPDF,
}) => (
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
    <div>
      <h1 className="text-3xl font-bold text-[#1E293B] mb-1">
        Gestión de Proveedores
      </h1>
      <p className="text-[#64748B]">Administra tu red de proveedores</p>
    </div>

    <div className="flex gap-3">
      <div className="relative">
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
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
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-[#E2E8F0] shadow-lg z-10 overflow-hidden"
            >
              <button
                onClick={onExportCSV}
                className="w-full px-4 py-3 text-left hover:bg-[#F8FAFC] transition-colors flex items-center gap-3 text-[#1E293B]"
              >
                <FileText size={18} className="text-[#64748B]" />
                <span className="font-medium">Exportar a CSV</span>
              </button>
              <button
                onClick={onExportPDF}
                className="w-full px-4 py-3 text-left hover:bg-[#F8FAFC] transition-colors flex items-center gap-3 text-[#1E293B]"
              >
                <FileText size={18} className="text-[#64748B]" />
                <span className="font-medium">Exportar a PDF</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={onNewSupplier}
        className="flex items-center gap-2 px-5 py-3 bg-[#CBD5E1] hover:bg-[#94A3B8] text-[#1E293B] rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
      >
        <Plus size={20} />
        Nuevo Proveedor
      </button>

      <FullscreenButton className='shadow'/>

    </div>
  </div>
);