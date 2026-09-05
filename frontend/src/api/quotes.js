import { request } from "./client";
export const createQuote = (data) => request("/quotes", { method: "POST", body: JSON.stringify(data) }); export const listQuotes = () => request("/quotes");
