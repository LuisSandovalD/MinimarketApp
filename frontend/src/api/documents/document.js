import authRequest from "../core/authRequest";
export const getDocument = () => authRequest('get','/admin/document');