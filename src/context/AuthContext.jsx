// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { authenticate, createUser } from "../services/mockDb.js";

const AuthContext = createContext(null);
const SESSION_KEY = "distribuidora_gas_session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
    } catch {
      return null;
    }
  });

  const saveSession = (u) => {
    // No guardamos la contraseña en la sesión
    const safeUser = { ...u };
    delete safeUser.password;
    setUser(safeUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  };

  const login = (email, password) => {
    const found = authenticate(email, password);
    if (!found) return { ok: false, error: "Correo o contraseña incorrectos." };
    saveSession(found);
    return { ok: true, user: found };
  };

  const register = (data) => {
    const result = createUser({ ...data, rol: "cliente" });
    if (!result.ok) return result;
    saveSession(result.user);
    return result;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const isAdmin = user?.rol === "admin";

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}