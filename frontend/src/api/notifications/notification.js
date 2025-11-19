import authRequest from "../core/authRequest";
export const getNotification = () => authRequest("get", "/admin/notifications");
