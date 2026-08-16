import { request } from "./client";

export const createInquiry = (payload) => request("/inquiries", {
  method: "POST",
  body: JSON.stringify(payload),
});
