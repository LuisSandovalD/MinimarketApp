// ============================================================================
// utils/exportUtils.js
// ============================================================================
// Funciones de utilidad para estadísticas y exportación de proveedores

/**
 * Calcula las estadísticas de los proveedores
 * @param {Array} suppliers - Array de proveedores
 * @returns {Object} Objeto con estadísticas calculadas
 */
export const calculateSupplierStats = (suppliers) => {
  if (!Array.isArray(suppliers)) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
      withEmail: 0,
    };
  }

  const activeSuppliers = suppliers.filter((s) => s.active).length;
  const inactiveSuppliers = suppliers.length - activeSuppliers;
  const suppliersWithEmail = suppliers.filter(
    (s) => s.email && s.email.trim() !== ""
  ).length;

  return {
    total: suppliers.length,
    active: activeSuppliers,
    inactive: inactiveSuppliers,
    withEmail: suppliersWithEmail,
  };
};

/**
 * Exporta los proveedores a formato CSV
 * @param {Array} suppliers - Array de proveedores a exportar
 */
export const exportToCSV = (suppliers) => {
  if (!Array.isArray(suppliers) || suppliers.length === 0) {
    console.warn("No hay datos para exportar");
    return;
  }

  // Definir encabezados
  const headers = ["Nombre", "RUC", "Teléfono", "Email", "Dirección", "Estado"];
  let csvContent = headers.join(",") + "\n";

  // Agregar filas de datos
  suppliers.forEach((item) => {
    const row = [
      `"${(item.name || "").replace(/"/g, '""')}"`, // Escapar comillas dobles
      item.ruc || "",
      item.phone || "",
      item.email || "",
      `"${(item.address || "").replace(/"/g, '""')}"`, // Escapar comillas dobles
      item.active ? "Activo" : "Inactivo",
    ];
    csvContent += row.join(",") + "\n";
  });

  // Crear blob y descargar
  const blob = new Blob(["\ufeff" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.href = url;
  link.download = `proveedores_${new Date().toISOString().split("T")[0]}.csv`;
  link.style.display = "none";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Liberar el objeto URL
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

/**
 * Exporta los proveedores a formato PDF (mediante impresión)
 * @param {Array} suppliers - Array de proveedores a exportar
 */
export const exportToPDF = (suppliers) => {
  if (!Array.isArray(suppliers) || suppliers.length === 0) {
    console.warn("No hay datos para exportar");
    return;
  }

  const printWindow = window.open("", "_blank");
  
  if (!printWindow) {
    alert("Por favor permite las ventanas emergentes para exportar a PDF");
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lista de Proveedores</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #1e293b;
        }
        
        h2 {
          color: #0f172a;
          text-align: center;
          margin-bottom: 10px;
          font-size: 24px;
        }
        
        .date {
          text-align: center;
          color: #64748b;
          margin-bottom: 30px;
          font-size: 14px;
        }
        
        .summary {
          text-align: center;
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        
        .summary p {
          margin: 5px 0;
          color: #475569;
          font-size: 13px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        
        th {
          background-color: #f8fafc;
          color: #1e293b;
          padding: 12px 8px;
          text-align: left;
          border: 1px solid #e2e8f0;
          font-size: 12px;
          font-weight: 600;
        }
        
        td {
          padding: 10px 8px;
          border: 1px solid #e2e8f0;
          font-size: 11px;
          color: #334155;
        }
        
        tr:nth-child(even) {
          background-color: #f8fafc;
        }
        
        .status-active {
          color: #16a34a;
          font-weight: bold;
        }
        
        .status-inactive {
          color: #dc2626;
          font-weight: bold;
        }
        
        .no-data {
          color: #94a3b8;
          font-style: italic;
        }
        
        @media print {
          body {
            padding: 10px;
          }
          
          table {
            page-break-inside: auto;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          thead {
            display: table-header-group;
          }
        }
      </style>
    </head>
    <body>
      <h2>Lista de Proveedores</h2>
      <p class="date">Fecha de generación: ${new Date().toLocaleDateString("es-PE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}</p>
      
      <div class="summary">
        <p><strong>Total de proveedores:</strong> ${suppliers.length}</p>
        <p><strong>Activos:</strong> ${suppliers.filter((s) => s.active).length} | <strong>Inactivos:</strong> ${suppliers.filter((s) => !s.active).length}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th style="width: 20%;">Nombre</th>
            <th style="width: 12%;">RUC</th>
            <th style="width: 12%;">Teléfono</th>
            <th style="width: 20%;">Email</th>
            <th style="width: 26%;">Dirección</th>
            <th style="width: 10%; text-align: center;">Estado</th>
          </tr>
        </thead>
        <tbody>
          ${suppliers
            .map(
              (item) => `
            <tr>
              <td>${item.name || '<span class="no-data">—</span>'}</td>
              <td>${item.ruc || '<span class="no-data">—</span>'}</td>
              <td>${item.phone || '<span class="no-data">—</span>'}</td>
              <td>${item.email || '<span class="no-data">—</span>'}</td>
              <td>${item.address || '<span class="no-data">—</span>'}</td>
              <td style="text-align: center;" class="${
                item.active ? "status-active" : "status-inactive"
              }">
                ${item.active ? "Activo" : "Inactivo"}
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Esperar a que se cargue el contenido antes de imprimir
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
};