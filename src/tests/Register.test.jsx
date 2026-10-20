
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import Register from "../pages/Register.jsx";
import { useAuth } from "../context/AuthContext.jsx";

vi.mock("../context/AuthContext.jsx", () => ({
  useAuth: vi.fn(),
}));

function UbicacionActual() {
  const location = useLocation();
  return <p>Ruta actual: {location.pathname}</p>;
}

function renderRegistro() {
  return render(
    <MemoryRouter initialEntries={["/registro"]}>
      <Routes>
        <Route path="/registro" element={<Register />} />
        <Route path="/" element={<h1>Página principal</h1>} />
        <Route path="/login" element={<h1>Iniciar sesión</h1>} />
      </Routes>
      <UbicacionActual />
    </MemoryRouter>
  );
}

async function completarFormulario(user, datos = {}) {
  await user.type(
    screen.getByRole("textbox", { name: "Nombre completo" }),
    datos.nombre ?? "Cliente de prueba"
  );
  await user.type(
    screen.getByRole("textbox", { name: "Correo electrónico" }),
    datos.email ?? "cliente@ejemplo.cl"
  );
  await user.type(
    screen.getByRole("textbox", { name: "Teléfono" }),
    datos.telefono ?? "912345678"
  );
  await user.type(
    screen.getByLabelText("Contraseña"),
    datos.password ?? "clave123"
  );
  await user.type(
    screen.getByLabelText("Confirmar contraseña"),
    datos.confirmarPassword ?? datos.password ?? "clave123"
  );
}

describe("Register", () => {
  const register = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ register });
  });

  it("muestra los campos del formulario y el enlace de inicio de sesión", () => {
    renderRegistro();

    expect(
      screen.getByRole("heading", { name: "Crear cuenta" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: "Nombre completo" })
    ).toBeRequired();

    expect(
      screen.getByRole("textbox", { name: "Correo electrónico" })
    ).toHaveAttribute("type", "email");

    expect(screen.getByRole("textbox", { name: "Teléfono" }))
      .toHaveAttribute("type", "tel");

    expect(
      screen.getByRole("link", { name: "Inicia sesión" })
    ).toHaveAttribute("href", "/login");
  });

  it("rechaza una contraseña con menos de seis caracteres", async () => {
    const user = userEvent.setup();
    renderRegistro();

    await completarFormulario(user, {
      password: "abc12",
      confirmarPassword: "abc12",
    });

    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "La contraseña debe tener al menos 6 caracteres."
    );
    expect(register).not.toHaveBeenCalled();
  });

  it("rechaza contraseñas que no coinciden", async () => {
    const user = userEvent.setup();
    renderRegistro();

    await completarFormulario(user, {
      password: "clave123",
      confirmarPassword: "clave456",
    });

    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Las contraseñas no coinciden."
    );
    expect(register).not.toHaveBeenCalled();
  });

  it("envía los datos normalizados y redirige cuando el registro es exitoso", async () => {
    const user = userEvent.setup();

    register.mockReturnValue({ ok: true, user: { id: 1 } });

    renderRegistro();

    await completarFormulario(user, {
      nombre: "  Cliente de prueba  ",
      email: "cliente@ejemplo.cl",
      telefono: "  912345678  ",
      password: "clave123",
      confirmarPassword: "clave123",
    });

    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(register).toHaveBeenCalledWith({
      nombre: "Cliente de prueba",
      email: "cliente@ejemplo.cl",
      telefono: "912345678",
      password: "clave123",
    });

    expect(
      await screen.findByRole("heading", { name: "Página principal" })
    ).toBeInTheDocument();

    expect(screen.getByText("Ruta actual: /")).toBeInTheDocument();
  });

  it("muestra el error devuelto cuando el registro falla", async () => {
    const user = userEvent.setup();

    register.mockReturnValue({
      ok: false,
      error: "El correo electrónico ya está registrado.",
    });

    renderRegistro();

    await completarFormulario(user);

    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "El correo electrónico ya está registrado."
    );
    expect(screen.getByText("Ruta actual: /registro")).toBeInTheDocument();
  });

  it("muestra un mensaje genérico cuando el registro falla sin entregar un error", async () => {
    const user = userEvent.setup();

    register.mockReturnValue({ ok: false });

    renderRegistro();

    await completarFormulario(user);

    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo crear la cuenta."
    );
  });
});
