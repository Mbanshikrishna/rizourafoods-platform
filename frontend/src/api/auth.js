import { request } from "./client";
export const login = (email, password) => request("/customer-auth/login", { method: "POST", body: JSON.stringify({ email, password }), noRefresh: true });
export const register = (data) => request("/customer-auth/register", { method: "POST", body: JSON.stringify(data), noRefresh: true });
export const logout = () => request("/customer-auth/logout", { method: "POST", body: "{}", noRefresh: true });
