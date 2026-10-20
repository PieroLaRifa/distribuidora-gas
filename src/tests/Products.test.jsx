
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Products from "../pages/Products.jsx";
import { getCategories, getProducts } from "../services/mockDb.js";
import { useCart } from "../context/CartContext.jsx";

vi.mock("../services/mockDb.js", () => ({
  getCategories: vi.fn(),
  getProducts: vi.fn(),
}));

vi.mock("../context/CartContext.jsx", () => ({
  useCart: vi.fn(),
}));

const categoriasPrueba = [
  { id: 1, nombre: "Cilindros Normales" },
  { id: 2, nombre: "Cilindros Catalíticos" },
];

const productosPrueba = [
  {
    id: 1,
    nombre: "Cilindro de gas 15 kg",
    categoriaId: 1,
    precio: 25000,
    stock: 5,
    imagen: "",
    descripcion: "Cilindro para uso doméstico",
  },
  {
    id: 2,
    nombre: "Cilindro catalítico 11 kg",
    categoriaId: 2,
    precio: 22000,
    stock: 3,
    imagen: "",
    descripcion: "Cilindro para estufa catalítica",
  },
  {
    id: 3,
    nombre: "Regulador de gas",
    categoriaId: 1,
    precio: 8000,
    stock: 0,
    imagen: "",
    descripcion: "Regulador para cilindros de gas",
  },
];

function renderCatalogo(rutaInicial = "/productos") {
  return render(
    <MemoryRouter initialEntries={[rutaInicial]}>
      <Routes>
        <Route path="/productos" element={<Products />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Products", () => {
  const addToCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    getCategories.mockReturnValue(categoriasPrueba);
    getProducts.mockReturnValue(productosPrueba);
    useCart.mockReturnValue({ addToCart });
  });

  it("muestra el catálogo y sus productos", () => {
    renderCatalogo();

    expect(
      screen.getByRole("heading", { name: "Catálogo de productos" })
    ).toBeInTheDocument();

    expect(screen.getByText("Cilindro de gas 15 kg")).toBeInTheDocument();
    expect(
      screen.getByText("Cilindro catalítico 11 kg")
    ).toBeInTheDocument();
    expect(screen.getByText("Regulador de gas")).toBeInTheDocument();

    expect(screen.getByText("3 productos encontrados")).toBeInTheDocument();
  });

  it("filtra productos por nombre sin distinguir mayúsculas", async () => {
    const user = userEvent.setup();
    renderCatalogo();

    await user.type(screen.getByRole("searchbox", {
      name: "Buscar producto",
    }), "REGULADOR");

    expect(screen.getByText("Regulador de gas")).toBeInTheDocument();
    expect(screen.queryByText("Cilindro de gas 15 kg")).not.toBeInTheDocument();
    expect(screen.getByText("1 producto encontrado")).toBeInTheDocument();
  });

  it("filtra los productos por la categoría seleccionada", async () => {
    const user = userEvent.setup();
    renderCatalogo();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Categoría" }),
      "2"
    );

    expect(
      screen.getByText("Cilindro catalítico 11 kg")
    ).toBeInTheDocument();
    expect(screen.queryByText("Cilindro de gas 15 kg")).not.toBeInTheDocument();
    expect(screen.queryByText("Regulador de gas")).not.toBeInTheDocument();

    expect(screen.getByText("1 producto encontrado")).toBeInTheDocument();
  });

  it("combina la búsqueda por nombre con el filtro de categoría", async () => {
    const user = userEvent.setup();
    renderCatalogo();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Categoría" }),
      "1"
    );

    await user.type(
      screen.getByRole("searchbox", { name: "Buscar producto" }),
      "cilindro"
    );

    expect(screen.getByText("Cilindro de gas 15 kg")).toBeInTheDocument();
    expect(
      screen.queryByText("Cilindro catalítico 11 kg")
    ).not.toBeInTheDocument();
    expect(screen.getByText("1 producto encontrado")).toBeInTheDocument();
  });

  it("muestra un mensaje cuando no existen coincidencias", async () => {
    const user = userEvent.setup();
    renderCatalogo();

    await user.type(
      screen.getByRole("searchbox", { name: "Buscar producto" }),
      "producto inexistente"
    );

    expect(
      screen.getByRole("heading", { name: "No encontramos productos" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Mostrar todos los productos" })
    ).toBeInTheDocument();
  });

  it("restablece la búsqueda y la categoría al limpiar los filtros", async () => {
    const user = userEvent.setup();
    renderCatalogo();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Categoría" }),
      "2"
    );

    await user.type(
      screen.getByRole("searchbox", { name: "Buscar producto" }),
      "catalítico"
    );

    await user.click(screen.getByRole("button", { name: "Limpiar filtros" }));

    expect(
      screen.getByRole("searchbox", { name: "Buscar producto" })
    ).toHaveValue("");

    expect(
      screen.getByRole("combobox", { name: "Categoría" })
    ).toHaveValue("todas");

    expect(screen.getByText("3 productos encontrados")).toBeInTheDocument();
  });

  it("agrega al carrito el producto seleccionado", async () => {
    const user = userEvent.setup();
    renderCatalogo();

    const tarjeta = screen
      .getByRole("heading", { name: "Cilindro de gas 15 kg" })
      .closest("article");

    await user.click(
      within(tarjeta).getByRole("button", { name: /Agregar al carrito/i })
    );

    expect(addToCart).toHaveBeenCalledTimes(1);
    expect(addToCart).toHaveBeenCalledWith(productosPrueba[0]);
  });

  it("deshabilita agregar al carrito cuando el producto no tiene stock", () => {
    renderCatalogo();

    const tarjeta = screen
      .getByRole("heading", { name: "Regulador de gas" })
      .closest("article");

    expect(screen.getByText("Sin stock disponible")).toBeInTheDocument();

    expect(
      within(tarjeta).getByRole("button", { name: /Agregar al carrito/i })
    ).toBeDisabled();
  });

  it("muestra la categoría indicada en los parámetros de la URL", () => {
    renderCatalogo("/productos?categoria=2");

    expect(
      screen.getByText("Categoría seleccionada:").parentElement
    ).toHaveTextContent("Cilindros Catalíticos");

    expect(
      screen.getByRole("combobox", { name: "Categoría" })
    ).toHaveValue("2");

    expect(
      screen.getByText("Cilindro catalítico 11 kg")
    ).toBeInTheDocument();
    expect(screen.queryByText("Regulador de gas")).not.toBeInTheDocument();
  });
});
