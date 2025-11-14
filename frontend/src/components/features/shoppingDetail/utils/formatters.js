export const formatPrice = (price) => {
  return `S/ ${Number(price).toFixed(2)}`;
};

export const formatQuantity = (quantity) => {
  return Number(quantity).toFixed(2);
};

export const formatSubtotal = (quantity, unitPrice) => {
  return (parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2);
};