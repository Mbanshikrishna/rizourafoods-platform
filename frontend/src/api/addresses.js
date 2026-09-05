import { request } from "./client";
export const listAddresses = () => request("/me/addresses"); export const addAddress = (data) => request("/me/addresses", { method: "POST", body: JSON.stringify(data) });
