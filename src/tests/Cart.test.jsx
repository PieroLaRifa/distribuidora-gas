
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Cart from "../pages/Cart.jsx";
import { useCart } from "../context/CartContext.jsx";

vi.mock("../context/CartContext.jsx", () => ({
  useCart: vi.fn(),
}));

const itemsIniciales = [
  {
    productId: 1,
    nombre: "Cilindro de gas 15 kg",
    precio: 25000,
    imagen: "",
    stock: 5,
    cantidad: 2,
  },
  {
    productId: 2,
    nombre: "Regulador de gas",
    precio: 8000,
    imagen: "",
    stock: 3,
    cantidad: 1,
  },
];

function renderCarrito(rutaInicial = "/carrito") {
  return render(
    <MemoryRouter initialEntries={[rutaInicial]}>
      <Routes>
        <Route path="/carrito" element={<Cart />} />
        <Route path="/productos" element={<h1>Catálogo de productos</h1>} />
        <Route path="/checkout" element={<h1>Finalizar compra</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Cart", () => {
  let items;
  let updateQuantity;
  let removeFromCart;
  let clearCart;

  beforeEach(() => {
    vi.clearAllMocks();

    items = itemsIniciales.map((item) => ({ ...item }));
    updateQuantity = vi.fn();
    removeFromCart = vi.fn();
    clearCart = vi.fn();

    useCart.mockImplementation(() => ({
      items,
      updateQuantity,
      removeFromCart,
      clearCart,
      subtotal: items.reduce(
        (total, item) => total + item.precio * item.cantidad,
        0
      ),
    }));
  });

  it("muestra un mensaje y un enlace cuando el carrito está vacío", () => {
    items = [];

    renderCarrito();

    expect(
      screen.getByRole("heading", { name: "Tu carrito está vacío" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Ver productos" })
    ).toHaveAttribute("href", "/productos");

    expect(
      screen.queryByRole("button", { name: "Vaciar carrito" })
    ).not.toBeInTheDocument();
  });

  it("muestra los productos y calcula el resumen de compra", () => {
    renderCarrito();

    expect(screen.getByText("Cilindro de gas 15 kg")).toBeInTheDocument();
    expect(screen.getByText("Regulador de gas")).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "Productos (3)" }))
      .toBeInTheDocument();

    // 2 × $25.000 + 1 × $8.000 = $58.000
    expect(screen.getAllByText("$58.000")).toHaveLength(2);
  });

  


it("solicita actualizar la cantidad cuando se ingresa un valor válido", () => {
  renderCarrito();

  const cantidad = screen.getAllByRole("spinbutton", {
    name: "Cantidad",
  })[0];

  fireEvent.change(cantidad, { target: { value: "3" } });

  expect(updateQuantity).toHaveBeenCalledWith(1, 3);
});



  it("no actualiza la cantidad si excede el stock", async () => {
    const user = userEvent.setup();
    renderCarrito();

    const cantidad = screen.getAllByRole("spinbutton", { name: "Cantidad" })[0];

    await user.clear(cantidad);
    await user.type(cantidad, "6");

    expect(updateQuantity).not.toHaveBeenCalled();
  });

  it("no actualiza la cantidad si el valor no es un entero válido", async () => {
    const user = userEvent.setup();
    renderCarrito();

    const cantidad = screen.getAllByRole("spinbutton", { name: "Cantidad" })[0];

    await user.clear(cantidad);
    await user.type(cantidad, "2.5");

    expect(updateQuantity).not.toHaveBeenCalled();
  });

  it("solicita eliminar el producto seleccionado", async () => {
    const user = userEvent.setup();
    renderCarrito();

    await user.click(
      screen.getByRole("button", {
        name: "Eliminar Cilindro de gas 15 kg del carrito",
      })
    );

    expect(removeFromCart).toHaveBeenCalledTimes(1);
    expect(removeFromCart).toHaveBeenCalledWith(1);
  });

  it("solicita vaciar todo el carrito", async () => {
    const user = userEvent.setup();
    renderCarrito();

    await user.click(
      screen.getByRole("button", { name: "Vaciar carrito" })
    );

    expect(clearCart).toHaveBeenCalledTimes(1);
  });

  it("permite continuar al checkout", () => {
    renderCarrito();

    expect(
      screen.getByRole("link", { name: "Continuar compra" })
    ).toHaveAttribute("href", "/checkout");
  });

  it("permite volver al catálogo para seguir comprando", () => {
    renderCarrito();

    expect(
      screen.getByRole("link", { name: "Seguir comprando" })
    ).toHaveAttribute("href", "/productos");
  });
});
