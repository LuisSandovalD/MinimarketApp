import authRequest from "./authRequest";

export const getProducts = () => authRequest("get", "/admin/products");
