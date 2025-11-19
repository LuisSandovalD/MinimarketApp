import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText } from "lucide-react";

export default function SalesExportMenu({ sales }) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const exportToCSV = () => {
    const headers = ["N° Venta", "Cliente", "Vendedor", "Método de Pago", "Fecha", "Tipo", "Total"];
    const rows = sales.map((sale) => [
      sale.sale_number,
      sale.customer?.name || "",
      sale.user?.name || "",
      sale.payment_method?.name || "",
      new Date(sale.date).toLocaleDateString("es-PE"),
      sale.credit ? "Crédito" : "Contado",
      Number(sale.total).toFixed(2),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ventas_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
    setShowExportMenu(false);
  };

  const exportToPDF = () => {
    const printWindow = window.open("", "_blank");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Lista de Ventas</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { color: #1e293b; text-align: center; margin-bottom: 10px; }
          .date { text-align: center; color: #64748b; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f1f5f9; color: #1e293b; padding: 12px; text-align: left; border: 1px solid #e2e8f0; font-size: 12px; }
          td { padding: 10px; border: 1px solid #e2e8f0; font-size: 11px; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .total-row { font-weight: bold; background-color: #e0f2fe; }
        </style>
      </head>
      <body>
        <h2>Lista de Ventas</h2>
        <p class="date">Fecha: ${new Date().toLocaleDateString("es-PE")}</p>
        <table>
          <thead>
            <tr>
              <th>N° Venta</th>
              <th>Cliente</th>
              <th>Vendedor</th>
              <th>Método de Pago</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${sales
              .map(
                (sale) => `
              <tr>
                <td>${sale.sale_number}</td>
                <td>${sale.customer?.name || "—"}</td>
                <td>${sale.user?.name || "—"}</td>
                <td>${sale.payment_method?.name || "—"}</td>
                <td>${new Date(sale.date).toLocaleDateString("es-PE")}</td>
                <td>${sale.credit ? "Crédito" : "Contado"}</td>
                <td>S/ ${Number(sale.total).toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
            <tr class="total-row">
              <td colspan="6" style="text-align: right;">Total:</td>
              <td>S/ ${sales.reduce((sum, s) => sum + Number(s.total), 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 250);

    setShowExportMenu(false);
  };

  return (
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
              onClick={exportToCSV}
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
  );
}