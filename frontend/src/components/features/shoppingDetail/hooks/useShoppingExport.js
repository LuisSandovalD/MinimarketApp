export const useShoppingExport = () => {
  const exportToCSV = (filteredDetails) => {
    const headers = [
      "ID Detalle",
      "Compra",
      "Producto",
      "Código",
      "Categoría",
      "Cantidad",
      "Precio Unit.",
      "Subtotal"
    ];
    
    const rows = filteredDetails.map((d) => [
      d.id,
      d.shopping?.shopping_number || "",
      d.product?.name || "",
      d.product?.code || "",
      d.product?.category?.name || "",
      d.quantity,
      d.unit_price,
      (parseFloat(d.quantity) * parseFloat(d.unit_price)).toFixed(2),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `detalles-compra-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return { exportToCSV };
};
