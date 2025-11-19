import authRequest from "../core/authRequest";


export const getCredits = () => authRequest("get", "/admin/credits");

export const updateCredit = (id, data) =>authRequest("put", `/admin/credits/${id}`, data);

export const updateMultipleCredits = (data) => authRequest("put", "/admin/credits", data);
