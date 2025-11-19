import authRequest from "../core/authRequest";
export const getShoppingDetail = () => authRequest("get", "/admin/shopping-detail");
export const createShoppingDetail = (data) => authRequest("post", "/admin/shopping-detail/create", data);
export const updateShoppingDetail = (id, data) => authRequest("put", `/admin/shopping-detail/update/${id}`, data);
export const deleteShoppingDetail = (id) => authRequest("delete", `/admin/shopping-detail/delete/${id}`);