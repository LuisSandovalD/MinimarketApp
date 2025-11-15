export const exportCustomersToExcel = (filtered, getCustomerCredits, setShowExportMenu) => {
  const headers = [
    "Nombre",
    "DNI/RUC",
    "Teléfono",
    "Email",
    "Dirección",
    "Estado",
    "Créditos Pendientes",
    "Total a Pagar",
  ];

  let csvContent = headers.join(",") + "\n";

  filtered.forEach((customer) => {
    const customerCredit = getCustomerCredits(customer.id);

    const row = [
      `"${customer.name || ""}"`,
      customer.dni_ruc || "",
      customer.phone || "",
      customer.email || "",
      `"${customer.address || ""}"`,
      customer.active ? "Activo" : "Inactivo",
      customerCredit?.pendingCredits.length || 0,
      `S/ ${Number(customerCredit?.totalWithInterest || 0).toFixed(2)}`,
    ];

    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = `clientes_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();

  setShowExportMenu(false);
};
export const exportCustomersToPDF = (filtered, getCustomerCredits, setShowExportMenu) => {
  const printWindow = window.open("", "_blank");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lista de Clientes</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { color: #1e293b; text-align: center; margin-bottom: 10px; }
        .date { text-align: center; color: #64748b; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #f1f5f9; color: #1e293b; padding: 12px; text-align: left; border: 1px solid #e2e8f0; font-size: 11px; }
        td { padding: 10px; border: 1px solid #e2e8f0; font-size: 10px; }
        tr:nth-child(even) { background-color: #f8fafc; }
        .status-active { color: #16a34a; font-weight: bold; }
        .status-inactive { color: #dc2626; font-weight: bold; }
      </style>
    </head>
    <body>
      <h2>Lista de Clientes</h2>
      <p class="date">Fecha: ${new Date().toLocaleDateString("es-PE")}</p>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>DNI/RUC</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Créditos</th>
            <th>Total Pendiente</th>
          </tr>
        </thead>
        <tbody>
          ${filtered
            .map((customer) => {
              const customerCredit = getCustomerCredits(customer.id);
              return `
                <tr>
                  <td>${customer.name || "—"}</td>
                  <td>${customer.dni_ruc || "—"}</td>
                  <td>${customer.phone || "—"}</td>
                  <td>${customer.email || "—"}</td>
                  <td class="${customer.active ? "status-active" : "status-inactive"}">
                    ${customer.active ? "Activo" : "Inactivo"}
                  </td>
                  <td>${customerCredit?.pendingCredits.length || 0}</td>
                  <td>S/ ${Number(customerCredit?.totalWithInterest || 0).toFixed(2)}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  setTimeout(() => printWindow.print(), 250);

  setShowExportMenu(false);
};
