
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "../pages/Login.jsx";
import { useAuth } from "../context/AuthContext.jsx";

vi.mock("../context/AuthContext.jsx", () => ({
  useAuth: vi.fn(),
}));

function UbicacionActual() {
  const location = useLocation();
  return <p>Ruta actual: {location.pathname}</p>;
}

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h1>Página principal</h1>} />
        <Route path="/admin" element={<h1>Panel administrativo</h1>} />
        <Route path="/registro" element={<h1>Registro de usuario</h1>} />
      </Routes>
      <UbicacionActual />
    </MemoryRouter>
  );
}

describe("Login", () => {
  const login = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ login });
  });

  it("muestra los campos y el botón de inicio de sesión", () => {
    renderLogin();

    expect(
      screen.getByRole("heading", { name: "Iniciar sesión" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: "Correo electrónico" })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Contraseña")
    ).toHaveAttribute("type", "password");

    expect(
      screen.getByRole("button", { name: "Ingresar" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Regístrate aquí" })
    ).toHaveAttribute("href", "/registro");
  });

  it("envía el correo sin espacios al inicio o al final", async () => {
    const user = userEvent.setup();
    login.mockReturnValue({
      ok: false,
      error: "Credenciales incorrectas",
    });

    renderLogin();

    await user.type(
      screen.getByRole("textbox", { name: "Correo electrónico" }),
      "  cliente@ejemplo.cl  "
    );

    await user.type(screen.getByLabelText("Contraseña"), "clave123");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(login).toHaveBeenCalledWith("cliente@ejemplo.cl", "clave123");
  });

  it("muestra un mensaje cuando las credenciales son incorrectas", async () => {
    const user = userEvent.setup();

    login.mockReturnValue({
      ok: false,
      error: "Credenciales incorrectas",
    });

    renderLogin();

    await user.type(
      screen.getByRole("textbox", { name: "Correo electrónico" }),
      "cliente@ejemplo.cl"
    );
    await user.type(screen.getByLabelText("Contraseña"), "incorrecta");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Credenciales incorrectas"
    );

    expect(screen.getByText("Ruta actual: /login")).toBeInTheDocument();
  });

  it("redirige a la página principal cuando inicia sesión un cliente", async () => {
    const user = userEvent.setup();

    login.mockReturnValue({
      ok: true,
      user: { rol: "cliente" },
    });

    renderLogin();

    await user.type(
      screen.getByRole("textbox", { name: "Correo electrónico" }),
      "cliente@ejemplo.cl"
    );
    await user.type(screen.getByLabelText("Contraseña"), "clave123");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(
      await screen.findByRole("heading", { name: "Página principal" })
    ).toBeInTheDocument();

    expect(screen.getByText("Ruta actual: /")).toBeInTheDocument();
  });

  it("redirige al panel administrativo cuando inicia sesión un administrador", async () => {
    const user = userEvent.setup();

    login.mockReturnValue({
      ok: true,
      user: { rol: "admin" },
    });

    renderLogin();

    await user.type(
      screen.getByRole("textbox", { name: "Correo electrónico" }),
      "admin@ejemplo.cl"
    );
    await user.type(screen.getByLabelText("Contraseña"), "claveAdmin");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(
      await screen.findByRole("heading", { name: "Panel administrativo" })
    ).toBeInTheDocument();

    expect(screen.getByText("Ruta actual: /admin")).toBeInTheDocument();
  });

  it("no llama a login si los campos obligatorios están vacíos", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(login).not.toHaveBeenCalled();
    expect(screen.getByText("Ruta actual: /login")).toBeInTheDocument();
  });
});
