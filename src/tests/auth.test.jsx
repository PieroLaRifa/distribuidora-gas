
import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import { resetDb } from "../services/mockDb.js";

function renderWithAuth(initialEntry, element) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AuthProvider>{element}</AuthProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
  resetDb();
});

describe("Autenticación y protección de rutas", () => {
  it("permite iniciar sesión como administrador", () => {
    renderWithAuth(
      "/login",
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={<h1>Panel administrativo</h1>}
        />
      </Routes>
    );

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "admin@gas.cl" },
    });

    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "admin123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(
      screen.getByRole("heading", { name: /panel administrativo/i })
    ).toBeTruthy();
  });

  it("muestra un error con credenciales incorrectas", () => {
    renderWithAuth("/login", <Login />);

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "admin@gas.cl" },
    });

    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "incorrecta" },
    });

    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(
      screen.getByRole("alert").textContent
    ).toMatch(/incorrectos/i);
  });

  it("registra una cuenta y crea una sesión de cliente", () => {
    renderWithAuth(
      "/registro",
      <Routes>
        <Route path="/registro" element={<Register />} />
        <Route path="/" element={<h1>Inicio de la tienda</h1>} />
      </Routes>
    );

    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: "Cliente de prueba" },
    });

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "nuevo@gas.cl" },
    });

    fireEvent.change(screen.getByLabelText(/teléfono/i), {
      target: { value: "+56912345678" },
    });

    fireEvent.change(screen.getByLabelText(/^contraseña$/i), {
      target: { value: "cliente123" },
    });

    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: "cliente123" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /crear cuenta/i })
    );

    expect(
      screen.getByRole("heading", { name: /inicio de la tienda/i })
    ).toBeTruthy();

    const session = JSON.parse(
      localStorage.getItem("distribuidora_gas_session")
    );

    expect(session.email).toBe("nuevo@gas.cl");
    expect(session.rol).toBe("cliente");
    expect(session.password).toBeUndefined();
  });

  it("rechaza el registro cuando el correo ya existe", () => {
    renderWithAuth("/registro", <Register />);

    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: "Otro cliente" },
    });

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "cliente@gas.cl" },
    });

    fireEvent.change(screen.getByLabelText(/teléfono/i), {
      target: { value: "+56912345678" },
    });

    fireEvent.change(screen.getByLabelText(/^contraseña$/i), {
      target: { value: "cliente123" },
    });

    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: "cliente123" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /crear cuenta/i })
    );

    expect(screen.getByRole("alert").textContent).toMatch(/ya existe/i);
  });

  it("redirige a login si no hay sesión", () => {
    renderWithAuth(
      "/admin",
      <Routes>
        <Route path="/login" element={<h1>Iniciar sesión</h1>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <h1>Panel administrativo</h1>
            </ProtectedRoute>
          }
        />
      </Routes>
    );

    expect(
      screen.getByRole("heading", { name: /iniciar sesión/i })
    ).toBeTruthy();
  });

  it("impide que un cliente acceda al panel administrativo", () => {
    localStorage.setItem(
      "distribuidora_gas_session",
      JSON.stringify({
        id: 2,
        nombre: "Cliente Demo",
        email: "cliente@gas.cl",
        rol: "cliente",
      })
    );

    renderWithAuth(
      "/admin",
      <Routes>
        <Route path="/" element={<h1>Inicio de la tienda</h1>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <h1>Panel administrativo</h1>
            </ProtectedRoute>
          }
        />
      </Routes>
    );

    expect(
      screen.getByRole("heading", { name: /inicio de la tienda/i })
    ).toBeTruthy();
  });
});
