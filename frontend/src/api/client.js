const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000/api/v1";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function request(path, { token, ...options } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(body?.message || "Unable to complete this request.", response.status);
  return body;
}
