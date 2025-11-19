export const exportPaymentsToExcel = (payments, stats) => {
  if (!Array.isArray(payments) || payments.length === 0) {
    alert("No hay datos para exportar");
    return;
  }

  // Verificar si XLSX está disponible
  if (typeof XLSX === "undefined") {
    console.error("La librería XLSX no está cargada");
    alert("Error: No se puede exportar. Librería no disponible.");
    return;
  }

  // Encabezados
  const headers = [
    "ID Pago",
    "ID Crédito",
    "Cliente",
    "Monto (S/)",
    "Fecha de Pago",
    "Usuario",
    "Notas",
  ];

  // Filas de datos
  const rows = payments.map((pago) => [
    pago.id,
    pago.credit_id,
    pago.credit?.sale?.customer?.name || "—",
    parseFloat(pago.amount || 0).toFixed(2),
    new Date(pago.payment_date).toLocaleString("es-PE"),
    pago.user?.name || pago.user_id || "—",
    pago.notes || "—",
  ]);

  // Fila de totales
  const totalRow = ["", "", "TOTAL:", stats.montoTotal.toFixed(2), "", "", ""];

  // Estructura de la hoja completa
  const worksheetData = [
    ["Reporte de Pagos de Créditos"],
    [`Fecha de exportación: ${new Date().toLocaleDateString("es-PE")}`],
    [`Total de pagos registrados: ${stats.totalPagos}`],
    [`Monto total: S/ ${stats.montoTotal.toFixed(2)}`],
    [],
    headers,
    ...rows,
    [],
    totalRow,
  ];

  // Crear hoja
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Ajustar ancho de columnas
  worksheet["!cols"] = [
    { wch: 10 }, // ID Pago
    { wch: 12 }, // ID Crédito
    { wch: 25 }, // Cliente
    { wch: 15 }, // Monto
    { wch: 22 }, // Fecha de Pago
    { wch: 20 }, // Usuario
    { wch: 35 }, // Notas
  ];

  // Crear libro
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Pagos");

  // Nombre del archivo
  const fileName = `Pagos_Creditos_${new Date().toISOString().slice(0, 10)}.xlsx`;

  // Exportar archivo Excel
  XLSX.writeFile(workbook, fileName);
};

export const calculatePaymentStats = (payments) => {
  if (!Array.isArray(payments) || payments.length === 0) {
    return {
      totalPagos: 0,
      montoTotal: 0,
      promedioMonto: 0,
    };
  }

  const totalPagos = payments.length;
  const montoTotal = payments.reduce(
    (sum, p) => sum + parseFloat(p.amount || 0),
    0
  );
  const promedioMonto = totalPagos > 0 ? montoTotal / totalPagos : 0;

  return {
    totalPagos,
    montoTotal,
    promedioMonto,
  };
};