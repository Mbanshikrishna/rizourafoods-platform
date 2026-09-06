import { request } from "./client";

export const listContacts = () => request("/me/contacts");
export const addContact = (data) => request("/me/contacts", { method: "POST", body: JSON.stringify(data) });
export const updateContact = (id, data) => request(`/me/contacts/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteContact = (id) => request(`/me/contacts/${id}`, { method: "DELETE" });
