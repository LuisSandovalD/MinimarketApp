import authRequest from "../core/authRequest";
export const getSalesDetail = () => authRequest("get","/admin/salesDetail")