import authRequest from "../core/authRequest";

export const getCategories = () => authRequest("get", "/admin/categories");
export const createCategory = (data) => authRequest("post", "/admin/categories/create/", data);
export const putCategory = (id, data) => authRequest("put", `/admin/categories/update/${id}`, data);
export const deleteCategory = (id) => authRequest("delete", `/admin/categories/delete/${id}`);

