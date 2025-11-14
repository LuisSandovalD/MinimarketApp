// src/components/features/products/utils/exportUtils.js
export const exportToCSVProducts = (products = []) => {
  const headers = ["Código", "Nombre", "Categoría", "Precio", "Stock", "Estado"];
  let csvContent = headers.join(",") + "\n";

  products.forEach((p) => {
    const row = [
      `"${p.code ?? ""}"`,
      `"${p.name ?? ""}"`,
      `"${p.category?.name ?? "Sin categoría"}"`,
      (typeof p.price === "number" ? p.price.toFixed(2) : p.price ?? ""),
      p.stock ?? "",
      p.is_active ? "Activo" : "Inactivo",
    ];
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `productos_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const exportToPDFProducts = (products = []) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Lista de Productos</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #1e293b; }
          h2 { text-align: center; font-size: 20px; margin-bottom: 6px; }
          .date { text-align: center; color: #64748b; margin-bottom: 20px; font-size: 13px; }
          table { width:100%; border-collapse:collapse; margin-top: 12px; font-size: 12px; }
          th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
          th { background:#f1f5f9; font-weight:600; }
          tr:nth-child(even){ background:#f8fafc; }
        </style>
      </head>
      <body>
        <h2>Lista de Productos</h2>
        <p class="date">Fecha: ${new Date().toLocaleDateString("es-PE")}</p>
        <table>
          <thead>
            <tr>
              <th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio (S/)</th><th>Stock</th><th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td>${p.code ?? ""}</td>
                <td>${p.name ?? ""}</td>
                <td>${p.category?.name ?? "Sin categoría"}</td>
                <td>${(typeof p.price === "number") ? p.price.toFixed(2) : (p.price ?? "")}</td>
                <td>${p.stock ?? ""}</td>
                <td>${p.is_active ? "Activo" : "Inactivo"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const w = window.open("", "_blank");
  if (!w) {
    alert("Permite ventanas emergentes para exportar el PDF.");
    return;
  }

  w.document.open();
  w.document.write(htmlContent);
  w.document.close();
  setTimeout(() => w.print(), 300);
};
