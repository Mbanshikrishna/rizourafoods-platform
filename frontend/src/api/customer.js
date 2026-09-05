import { request } from "./client";
export const getMe = () => request("/me"); export const updateMe = (data) => request("/me", { method: "PATCH", body: JSON.stringify(data) }); export const getBusiness = () => request("/me/business"); export const updateBusiness = (data) => request("/me/business", { method: "PATCH", body: JSON.stringify(data) });
