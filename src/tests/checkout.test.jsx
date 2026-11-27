
import { beforeEach, describe, expect, it } from "vitest";
import {
  createOrder,
  getOrders,
  getProductById,
  resetDb,
} from "../services/mockDb.js";

beforeEach(() => {
  localStorage.clear();
  resetDb();
});

describe("Flujo de compra", () => {
  it("crea una orden y guarda los datos del cliente", () => {
    const result = createOrder({
      userId: 2,
      cliente: {
        nombre: "Cliente Demo",
        email: "cliente@gas.cl",
        telefono: "+56922222222",
      },
      direccion: {
        calle: "Av. Principal 123",
        depto: "",
        comuna: "Santiago",
        indicaciones: "",
      },
      items: [{ productId: 1, cantidad: 2 }],
    });

    expect(result.ok).toBe(true);
    expect(result.order.numeroOrden).toBe("GAS-000001");
    expect(result.order.total).toBe(29000);
    expect(result.order.estado).toBe("Pagada");
    expect(getOrders()).toHaveLength(1);
  });

  it("descuenta el stock después de una compra", () => {
    const initialProduct = getProductById(1);

    createOrder({
      cliente: { nombre: "Cliente", email: "cliente@gas.cl" },
      direccion: { calle: "Calle 1", comuna: "Santiago" },
      items: [{ productId: 1, cantidad: 3 }],
    });

    expect(getProductById(1).stock).toBe(initialProduct.stock - 3);
  });

  it("rechaza una compra con el carrito vacío", () => {
    const result = createOrder({
      cliente: { nombre: "Cliente" },
      direccion: {},
      items: [],
    });

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/carrito está vacío/i);
    expect(getOrders()).toHaveLength(0);
  });

  it("rechaza una compra cuando no existe el producto", () => {
    const result = createOrder({
      cliente: { nombre: "Cliente" },
      direccion: {},
      items: [{ productId: 9999, cantidad: 1 }],
    });

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/producto no encontrado/i);
    expect(getOrders()).toHaveLength(0);
  });

  it("rechaza una compra que supera el stock disponible", () => {
    const product = getProductById(1);
    const initialStock = product.stock;

    const result = createOrder({
      cliente: { nombre: "Cliente" },
      direccion: {},
      items: [{ productId: 1, cantidad: initialStock + 1 }],
    });

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/stock insuficiente/i);
    expect(getProductById(1).stock).toBe(initialStock);
    expect(getOrders()).toHaveLength(0);
  });
});
