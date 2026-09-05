import { request } from "./client";
export const createSample = (data) => request("/samples", { method: "POST", body: JSON.stringify(data) }); export const listSamples = () => request("/samples");
