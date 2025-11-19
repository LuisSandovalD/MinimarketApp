export const calculateSupplierStats = (suppliers) => {
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
