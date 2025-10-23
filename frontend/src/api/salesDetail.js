import authRequest from "./authRequest";
export const getSalesDetail = () => authRequest("get","/admin/salesDetail")