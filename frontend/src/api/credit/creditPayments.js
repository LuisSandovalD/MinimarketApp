import authRequest from "../core/authRequest";
export const getCreditPayments = () => authRequest("get", "/admin/creditsPayment");