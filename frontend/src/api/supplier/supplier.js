import authRequest from "../core/authRequest";
export const getSupplier = () => authRequest("get", "/admin/suppliers");
export const createSupplier = (data) => authRequest("post", "/admin/suppliers/create", data);
export const updateSupplier = (id, data) => authRequest("put", `/admin/suppliers/update/${id}`, data);
export const deleteSupplier = (id, data) => authRequest("put", `/admin/suppliers/delete/${id}`, data);
