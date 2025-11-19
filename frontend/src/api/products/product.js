import authRequest from "../core/authRequest";

export const getProducts = () => authRequest("get", "/admin/products");
