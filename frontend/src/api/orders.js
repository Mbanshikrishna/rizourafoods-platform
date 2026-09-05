import { request } from "./client";
export const listOrders = () => request("/orders"); export const reorder = (id) => request(`/orders/${id}/reorder`, { method: "POST", body: "{}" });
