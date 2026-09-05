import { request } from "./client";

export const listProducts = (filters = {}) => {
  const query = new URLSearchParams({ status: "PUBLISHED", pageSize: "100", ...filters });
  return request(`/products?${query}`).then((response) => response.data);
};

export const getProduct = (slug) => request(`/products/slug/${encodeURIComponent(slug)}`).then((response) => response.data);
