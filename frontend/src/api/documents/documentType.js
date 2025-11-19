import authRequest from "../core/authRequest";

export const getDocumentTypes = () => authRequest("get", "/admin/document-types");
export const createDocumentType = (data) => authRequest("post", "/admin/document-types/create", data);
export const updateDocumentType = (id, data) => authRequest("put", `/admin/document-types/update/${id}`, data);
export const deleteDocumentType = (id) => authRequest("delete", `/admin/document-types/delete/${id}`);
