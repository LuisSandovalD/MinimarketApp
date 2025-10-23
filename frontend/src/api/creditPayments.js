import authRequest from "./authRequest";
export const getCreditPayments = () => authRequest("get", "/admin/creditsPayment");