export const exportToCSV = (users) => {
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
};

export const exportToPDF = (users) => {
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
};