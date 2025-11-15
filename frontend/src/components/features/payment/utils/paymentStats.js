export const calculatePaymentStats = (paymentMethods) => {
  if (!Array.isArray(paymentMethods)) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
    };
  }

  return {
    total: paymentMethods.length,
    active: paymentMethods.filter((m) => m.active).length,
    inactive: paymentMethods.filter((m) => !m.active).length,
  };
};