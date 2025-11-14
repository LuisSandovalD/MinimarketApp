import authRequest from "../core/authRequest";

export const getPayment = () => authRequest("get", "/admin/payment-methods");
export const createPaymentMethod = (data) => authRequest("post", "/admin/payment-methods", data);
export const updatePaymentMethod = (id, data) => authRequest("put", `/admin/payment-methods/${id}`, data);
export const deletePaymentMethod = (id) => authRequest("delete", `/admin/payment-methods/${id}`);
