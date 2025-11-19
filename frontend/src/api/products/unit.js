import authRequest from "../core/authRequest";
export const getUnits = () => authRequest("get", "/admin/units");
export const createUnit = (data) => authRequest("post", "/admin/units/create/", data);
export const putUnit = (id, data) => authRequest("put", `/admin/units/update/${id}`, data);
export const deleteUnit = (id) => authRequest("delete", `/admin/units/delete/${id}`);

