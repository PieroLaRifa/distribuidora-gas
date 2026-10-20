
import { beforeEach, describe, expect, it } from "vitest";

import {
  resetDb,
  getProducts,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  authenticate,
  createOrder,
} from "../services/mockDb.js";

describe("Pruebas unitarias de mockDb", () => {
  beforeEach(() => {
    resetDb();
  });

  it("1. obtiene el catálogo inicial de productos", () => {
    const products = getProducts();

    expect(products.length).toBeGreaterThan(0);
    expect(products[0].nombre).toBeDefined();
  });

  it("2. busca un producto por su ID", () => {
    const product = getProductById(1);

    expect(product).not.toBeNull();
    expect(product.id).toBe(1);
    expect(product.nombre).toBe("Cilindro Normal 5 kg");
  });

  it("3. filtra productos por categoría", () => {
    const products = getProductsByCategory(1);

    expect(products.length).toBeGreaterThan(0);
    expect(products.every((p) => p.categoriaId === 1)).toBe(true);
  });

  it("4. obtiene únicamente productos destacados", () => {
    const products = getFeaturedProducts();

    expect(products.length).toBeGreaterThan(0);
    expect(products.every((p) => p.destacado === true)).toBe(true);
  });

  it("5. crea un producto con un nuevo ID", () => {
    const product = createProduct({
      nombre: "Cilindro de prueba",
      categoriaId: 1,
      precio: 18000,
      stock: 20,
    });

    expect(product.id).toBe(11);
    expect(getProductById(11).nombre).toBe("Cilindro de prueba");
  });

  it("6. actualiza el precio de un producto", () => {
    const product = updateProduct(1, { precio: 16000 });

    expect(product.precio).toBe(16000);
    expect(getProductById(1).precio).toBe(16000);
  });

  it("7. elimina un producto existente", () => {
    const deleted = deleteProduct(10);

    expect(deleted).toBe(true);
    expect(getProductById(10)).toBeNull();
  });

  it("8. crea una categoría", () => {
    const category = createCategory({
      nombre: "Categoría de prueba",
      descripcion: "Categoría para testing",
    });

    expect(category.id).toBe(4);
    expect(category.nombre).toBe("Categoría de prueba");
  });

  it("9. autentica credenciales válidas y rechaza las incorrectas", () => {
    expect(authenticate("admin@gas.cl", "admin123")).not.toBeNull();
    expect(authenticate("admin@gas.cl", "incorrecta")).toBeNull();
  });

  it("10. crea una orden y descuenta el stock", () => {
    const stockInicial = getProductById(1).stock;

    const result = createOrder({
      cliente: {
        nombre: "Cliente de prueba",
        email: "prueba@gas.cl",
        telefono: "123456789",
      },
      direccion: {
        calle: "Calle de prueba",
        depto: "",
        comuna: "Santiago",
        indicaciones: "",
      },
      items: [{ productId: 1, cantidad: 2 }],
    });

    expect(result.ok).toBe(true);
    expect(result.order.total).toBe(29000);
    expect(getProductById(1).stock).toBe(stockInicial - 2);
  });
});
