const API_URL = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "distribuidora_gas_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error("No fue posible conectar con el servidor.");
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      (response.status === 401
        ? "Correo o contraseña incorrectos."
        : response.status === 403
          ? "No tienes permisos para realizar esta operación."
          : "No fue posible completar la solicitud.");
    throw new Error(message);
  }

  return data;
}

export const authApi = {
  login: (email, password) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (data) =>
    apiRequest("/usuarios/registro", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
