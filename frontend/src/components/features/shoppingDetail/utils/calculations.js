export const calculateStats = (filteredDetails) => {
  const totalItems = filteredDetails.reduce(
    (sum, d) => sum + (parseFloat(d.quantity) || 0),
    0
  );
  
  const totalValue = filteredDetails.reduce(
    (sum, d) => sum + (parseFloat(d.quantity) * parseFloat(d.unit_price) || 0),
    0
  );
  
  const uniqueProducts = new Set(filteredDetails.map((d) => d.product_id)).size;
  const uniqueShoppings = new Set(filteredDetails.map((d) => d.shopping_id)).size;

  return {
    totalDetails: filteredDetails.length,
    totalItems: totalItems.toFixed(2),
    totalValue: totalValue.toFixed(2),
    uniqueProducts,
    uniqueShoppings,
    averagePrice: filteredDetails.length > 0 
      ? (totalValue / filteredDetails.length).toFixed(2) 
      : "0.00",
  };
};

export const groupDetailsByShoppingId = (filteredDetails) => {
  const groups = {};
  filteredDetails.forEach((detail) => {
    const shoppingId = detail.shopping_id || "Sin compra";
    if (!groups[shoppingId]) {
      groups[shoppingId] = {
        shopping: detail.shopping,
        items: []
      };
    }
    groups[shoppingId].items.push(detail);
  });
  return groups;
};

export const calculateGroupTotal = (items) => {
  return items.reduce(
    (sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.unit_price) || 0),
    0
  );
};

export const calculateGroupItems = (items) => {
  return items.reduce(
    (sum, item) => sum + (parseFloat(item.quantity) || 0),
    0
  );
};
