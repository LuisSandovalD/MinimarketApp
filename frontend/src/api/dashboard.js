import authRequest from "./authRequest";

export const getDashboardData = () => authRequest("get", "/admin/dashboard/data");