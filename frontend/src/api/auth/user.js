import authRequest from "../core/authRequest";
export const getUserRegister = () => authRequest("get", "/admin/users");
export const updateUser = (id, data) => authRequest("put", `/admin/users/update/${id}`, data);
export const deleteUser = (id) => authRequest("delete", `/admin/users/delete/${id}`);
