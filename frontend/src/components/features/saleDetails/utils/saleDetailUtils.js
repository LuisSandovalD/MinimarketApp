export const calculateTotalGeneral = (details) => {
  if (!Array.isArray(details)) return 0;
  return details.reduce((sum, d) => sum + parseFloat(d.subtotal || 0), 0);
};

// utils/exportUtils.js
export const exportSaleDetailsToPDF = (details, totalGeneral) => {
  if (!Array.isArray(details) || details.length === 0) {
    alert("No hay datos para exportar");
    return;
  }

  const content = `DETALLES DE VENTAS
Fecha de generación: ${new Date().toLocaleString("es-PE")}
Total de registros: ${details.length}
Total general: S/ ${totalGeneral.toFixed(2)}

${"=".repeat(100)}

${details
  .map(
    (d, i) => `
${i + 1}. VENTA #${d.sale?.id || "—"}
   Producto: ${d.product?.name || "N/A"}
   Código: ${d.product?.code || "N/A"}
   Categoría: ${d.product?.category || "—"}
   Cantidad: ${d.quantity}
   Precio Unitario: S/ ${parseFloat(d.unit_price).toFixed(2)}
   Subtotal: S/ ${parseFloat(d.subtotal).toFixed(2)}
${"-".repeat(100)}`
  )
  .join("\n")}

${"=".repeat(100)}
TOTAL GENERAL: S/ ${totalGeneral.toFixed(2)}
${"=".repeat(100)}
`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `detalles-ventas-${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportSaleDetailsToExcel = (details, totalGeneral) => {
  if (!Array.isArray(details) || details.length === 0) {
    alert("No hay datos para exportar");
    return;
  }

  const headers = [
    "N°",
    "Venta ID",
    "Producto",
    "Código",
    "Categoría",
    "Cantidad",
    "Precio Unitario",
    "Subtotal",
  ];

  const rows = details.map((d, i) => [
    i + 1,
    d.sale?.id || "—",
    d.product?.name || "N/A",
    d.product?.code || "N/A",
    d.product?.category || "—",
    d.quantity,
    parseFloat(d.unit_price).toFixed(2),
    parseFloat(d.subtotal).toFixed(2),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const cellStr = String(cell);
          return cellStr.includes(",") ||
            cellStr.includes('"') ||
            cellStr.includes("\n")
            ? `"${cellStr.replace(/"/g, '""')}"`
            : cellStr;
        })
        .join(",")
    ),
    "",
    `,,,,,,"TOTAL GENERAL:",${totalGeneral.toFixed(2)}`,
  ].join("\n");

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `detalles-ventas-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};