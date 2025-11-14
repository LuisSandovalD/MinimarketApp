// src/components/features/products/components/ProductExportMenu.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileDown, FileSpreadsheet, ChevronDown } from "lucide-react";
import { exportToCSVProducts, exportToPDFProducts } from "../utils/exporUtils";

export default function ProductExportMenu({ products = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCSV = () => {
    if (!products.length) return alert("No hay productos para exportar.");
    exportToCSVProducts(products);
    setOpen(false);
  };

  const handlePDF = () => {
    if (!products.length) return alert("No hay productos para exportar.");
    exportToPDFProducts(products);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="gap-4 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow border border-gray-200 px-5 py-2.5 rounded-xl  border-dark/40text-dark font-medium transition-all flex items-center gap-2 transform">
        <Download size={18} />
        Exportar
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2, ease: "easeOut" }} className="absolute right-0 mt-3 w-64 bg-white rounded-xl border-2 border-blue-100 shadow-2xl z-50 overflow-hidden" >
            <button onClick={handleCSV} className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-700 text-sm hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all group border-b border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <FileSpreadsheet size={20} className="text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-800 group-hover:text-green-700">
                  Exportar a CSV
                </div>
                <div className="text-xs text-gray-500">
                  Excel, hojas de cálculo
                </div>
              </div>
            </button>

            {/* Opción PDF */}
            <button onClick={handlePDF} className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-700 text-sm hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50  transition-all group" >
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <FileDown size={20} className="text-red-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-800 group-hover:text-red-700">
                  Exportar a PDF
                </div>
                <div className="text-xs text-gray-500">
                  Documento imprimible
                </div>
              </div>
            </button>

            {/* Footer con contador */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                {products.length} {products.length === 1 ? 'producto' : 'productos'} disponibles
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}