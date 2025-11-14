import authRequest from "../core/authRequest";
export const getCustomerRegister = () => authRequest("get", "/admin/customer");
export const createCustomer = (data) => authRequest("post", "/admin/customer/create", data);
export const updateCustomer = (id, data) => authRequest("put", `/admin/customer/update/${id}`, data);
export const deleteCustomer = (id) => authRequest("delete", `/admin/customer/delete/${id}`);
