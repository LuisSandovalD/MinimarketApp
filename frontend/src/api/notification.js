import authRequest from "./authRequest";
export const getNotification = () => authRequest("get", "/admin/notifications");
