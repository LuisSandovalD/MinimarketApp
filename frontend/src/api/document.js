import authRequest from "./authRequest";
export const getDocument = () => authRequest('get','/admin/document');