import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText } from "lucide-react";

export default function UserExportMenu({ users }) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const exportToExcel = () => {
    const headers = ["Nombre", "Email", "Rol", "Permisos", "Fecha Registro"];
    let csvContent = headers.join(",") + "\n";

    users.forEach((user) => {
      const roleName = user.roles?.[0]?.name || "Sin rol";
      const permissions = user.roles?.[0]?.permissions?.map((p) => p.name).join("; ") || "Sin permisos";
      const row = [
        `"${user.name}"`,
        user.email,
        roleName,
        `"${permissions}"`,
        new Date(user.created_at).toLocaleDateString('es-PE'),
      ];
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `usuarios_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    setShowExportMenu(false);
  };

  const exportToPDF = () => {
    const printWindow = window.open("", "_blank");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Lista de Usuarios</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { color: #1e293b; text-align: center; margin-bottom: 10px; }
          .date { text-align: center; color: #64748b; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f1f5f9; color: #1e293b; padding: 12px; text-align: left; border: 1px solid #e2e8f0; font-size: 12px; }
          td { padding: 10px; border: 1px solid #e2e8f0; font-size: 11px; }
          tr:nth-child(even) { background-color: #f8fafc; }
        </style>
      </head>
      <body>
        <h2>Lista de Usuarios</h2>
        <p class="date">Fecha: ${new Date().toLocaleDateString('es-PE')}</p>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha Registro</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(user => `
              <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.roles?.[0]?.name || "Sin rol"}</td>
                <td>${new Date(user.created_at).toLocaleDateString('es-PE')}</td>
              </tr>
            `).join('')}
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
  );
}