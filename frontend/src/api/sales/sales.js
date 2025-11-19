import authRequest from "../core/authRequest";

export const getSales = () => authRequest("get", "/admin/sales");
export const getSalesProducts = () => authRequest("get", "/admin/sales/products");
export const createSales = (data) => authRequest("post", "/admin/sales/create", data);
export const updateSales = (id, data) => authRequest("put", `/admin/sales/update/${id}`, data);
export const deleteSales = (id) => authRequest("delete", `/admin/sales/delete/${id}`);
