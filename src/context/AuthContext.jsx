import { createContext, useContext, useMemo, useState } from "react";
import { authApi, clearToken, saveToken } from "../services/api.js";

const AuthContext = createContext(null);
const SESSION_KEY = "distribuidora_gas_session";

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

function normalizeUser(data) {
  return {
    id: data.id,
    nombre: data.nombre,
    email: data.email,
    rol: String(data.rol || "cliente").toLowerCase(),
    telefono: data.telefono || "",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const saveSession = (data) => {
    const safeUser = normalizeUser(data);
    saveToken(data.token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    setUser(safeUser);
    return safeUser;
  };

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email.trim().toLowerCase(), password);
      const authenticatedUser = saveSession(response);
      return { ok: true, user: authenticatedUser };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  };

  const register = async (data) => {
    try {
      await authApi.register({
        nombre: data.nombre.trim(),
        email: data.email.trim().toLowerCase(),
        telefono: data.telefono.trim(),
        password: data.password,
      });

      return await login(data.email, data.password);
    } catch (error) {
      return { ok: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    clearToken();
  };

  const isAdmin = user?.rol === "admin";

  const value = useMemo(
    () => ({ user, isAdmin, login, register, logout }),
    [user, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
