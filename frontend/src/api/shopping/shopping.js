import authRequest from "../core/authRequest";
export const getShopping = () => authRequest("get", "/admin/shopping");
export const createShopping = (data) => authRequest("post", "/admin/shopping/create", data);
export const updateShopping = (id, data) => authRequest("put", `/admin/shopping/update/${id}`, data);
export const deleteShopping = (id) => authRequest("delete", `/admin/shopping/delete/${id}`);
