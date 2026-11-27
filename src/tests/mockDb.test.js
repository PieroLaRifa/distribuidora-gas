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
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  authenticate,
  getOrders,
  getOrderById,
  getOrdersByUser,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getDashboardStats
} from "../services/mockDb.js";

describe("Pruebas unitarias de mockDb", () => {
  beforeEach(() => {
    resetDb();
  });

  describe("Productos", () => {
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

    it("3. devuelve null cuando el producto no existe", () => {
      expect(getProductById(9999)).toBeNull();
    });

    it("4. filtra productos por categoría", () => {
      const products = getProductsByCategory(1);

      expect(products.length).toBeGreaterThan(0);
      expect(products.every((p) => p.categoriaId === 1)).toBe(true);
    });

    it("5. devuelve una lista vacía para una categoría sin productos", () => {
      expect(getProductsByCategory(9999)).toEqual([]);
    });

    it("6. obtiene únicamente productos destacados", () => {
      const products = getFeaturedProducts();

      expect(products.length).toBeGreaterThan(0);
      expect(products.every((p) => p.destacado === true)).toBe(true);
    });

    it("7. crea un producto con un nuevo ID y valores predeterminados", () => {
      const product = createProduct({
        nombre: "Cilindro de prueba",
        categoriaId: 1,
        precio: 18000,
        stock: 20,
      });

      expect(product.id).toBe(11);
      expect(product.imagen).toBe(
        "https://placehold.co/400x300?text=Producto",
      );
      expect(product.descripcion).toBe("");
      expect(product.destacado).toBe(false);
      expect(getProductById(11).nombre).toBe("Cilindro de prueba");
    });

    it("8. actualiza el precio y convierte los valores numéricos", () => {
      const product = updateProduct(1, {
        precio: "16000",
        stock: "15",
        categoriaId: "2",
      });

      expect(product.precio).toBe(16000);
      expect(product.stock).toBe(15);
      expect(product.categoriaId).toBe(2);
      expect(getProductById(1).precio).toBe(16000);
    });

    it("9. devuelve null al actualizar un producto inexistente", () => {
      expect(updateProduct(9999, { precio: 1000 })).toBeNull();
    });

    it("10. elimina un producto existente", () => {
      expect(deleteProduct(10)).toBe(true);
      expect(getProductById(10)).toBeNull();
    });

    it("11. devuelve false al eliminar un producto inexistente", () => {
      expect(deleteProduct(9999)).toBe(false);
    });
  });

  describe("Categorías", () => {
    it("12. obtiene las categorías iniciales", () => {
      expect(getCategories().length).toBeGreaterThan(0);
    });

    it("13. busca una categoría por ID y devuelve null si no existe", () => {
      expect(getCategoryById(1).id).toBe(1);
      expect(getCategoryById(9999)).toBeNull();
    });

    it("14. crea una categoría", () => {
      const category = createCategory({
        nombre: "Categoría de prueba",
        descripcion: "Categoría para testing",
      });

      expect(category.id).toBe(4);
      expect(category.nombre).toBe("Categoría de prueba");
    });

    it("15. actualiza una categoría existente", () => {
      const category = updateCategory(1, {
        nombre: "Categoría actualizada",
      });

      expect(category.nombre).toBe("Categoría actualizada");
      expect(getCategoryById(1).nombre).toBe("Categoría actualizada");
    });

    it("16. devuelve null al actualizar una categoría inexistente", () => {
      expect(updateCategory(9999, { nombre: "No existe" })).toBeNull();
    });

    it("17. impide eliminar una categoría con productos asociados", () => {
      const result = deleteCategory(1);

      expect(result.ok).toBe(false);
      expect(result.error).toBe(
        "La categoría tiene productos asociados.",
      );
      expect(getCategoryById(1)).not.toBeNull();
    });

    it("18. permite eliminar una categoría sin productos asociados", () => {
      const category = createCategory({
        nombre: "Categoría vacía",
      });

      const result = deleteCategory(category.id);

      expect(result.ok).toBe(true);
      expect(getCategoryById(category.id)).toBeNull();
    });
  });

  describe("Usuarios y autenticación", () => {
    it("19. obtiene usuarios y busca uno por ID", () => {
      expect(getUsers().length).toBeGreaterThan(0);
      expect(getUserById(1).id).toBe(1);
      expect(getUserById(9999)).toBeNull();
    });

    it("20. crea un usuario con rol y teléfono predeterminados", () => {
      const result = createUser({
        nombre: "Usuario de prueba",
        email: "nuevo@gas.cl",
        password: "clave123",
      });

      expect(result.ok).toBe(true);
      expect(result.user.rol).toBe("cliente");
      expect(result.user.telefono).toBe("");
      expect(getUserById(result.user.id).email).toBe("nuevo@gas.cl");
    });

    it("21. rechaza un correo electrónico duplicado sin distinguir mayúsculas", () => {
      const existingUser = getUsers()[0];

      const result = createUser({
        nombre: "Duplicado",
        email: existingUser.email.toUpperCase(),
        password: "clave123",
      });

      expect(result.ok).toBe(false);
      expect(result.error).toBe(
        "Ya existe un usuario con ese correo.",
      );
    });

    it("22. actualiza un usuario existente", () => {
      const user = updateUser(1, {
        nombre: "Nombre actualizado",
      });

      expect(user.nombre).toBe("Nombre actualizado");
      expect(getUserById(1).nombre).toBe("Nombre actualizado");
    });

    it("23. devuelve null al actualizar un usuario inexistente", () => {
      expect(updateUser(9999, { nombre: "No existe" })).toBeNull();
    });

    it("24. elimina un usuario existente y rechaza un ID inexistente", () => {
      expect(deleteUser(1)).toBe(true);
      expect(getUserById(1)).toBeNull();
      expect(deleteUser(9999)).toBe(false);
    });

    it("25. autentica credenciales válidas y rechaza las incorrectas", () => {
      expect(authenticate("admin@gas.cl", "admin123")).not.toBeNull();
      expect(authenticate("admin@gas.cl", "incorrecta")).toBeNull();
    });

    it("26. permite autenticar usando el correo sin distinguir mayúsculas", () => {
      expect(
        authenticate("ADMIN@GAS.CL", "admin123"),
      ).not.toBeNull();
    });
  });

  describe("Órdenes", () => {
    it("27. crea una orden y descuenta el stock", () => {
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
      expect(getOrderById(result.order.id)).not.toBeNull();
    });

    it("28. rechaza una orden sin artículos", () => {
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
        items: [],
      });

      expect(result.ok).toBe(false);
    });

    it("29. obtiene órdenes y filtra por usuario", () => {
      expect(Array.isArray(getOrders())).toBe(true);
      expect(Array.isArray(getOrdersByUser(1))).toBe(true);
      expect(getOrderById(9999)).toBeNull();
    });
    it("30. rechaza una orden con un producto inexistente", () => {
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
    items: [{ productId: 9999, cantidad: 1 }],
  });

  expect(result.ok).toBe(false);
  expect(result.error).toBe("Producto no encontrado.");
  expect(getProductById(1).stock).toBe(stockInicial);
  expect(getOrders()).toHaveLength(0);
});

it("31. rechaza una orden cuando no hay stock suficiente", () => {
  const product = getProductById(1);
  const stockInicial = product.stock;

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
    items: [
      {
        productId: 1,
        cantidad: stockInicial + 1,
      },
    ],
  });

  expect(result.ok).toBe(false);
  expect(result.error).toContain("Stock insuficiente");
  expect(getProductById(1).stock).toBe(stockInicial);
  expect(getOrders()).toHaveLength(0);
});

it("32. actualiza el estado de una orden", () => {
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
    items: [{ productId: 1, cantidad: 1 }],
  });

  const updated = updateOrderStatus(result.order.id, "En preparación");

  expect(updated.estado).toBe("En preparación");
  expect(getOrderById(result.order.id).estado).toBe("En preparación");
});

it("33. devuelve null al actualizar una orden inexistente", () => {
  expect(updateOrderStatus(9999, "En preparación")).toBeNull();
});

it("34. elimina una orden existente y devuelve false para una inexistente", () => {
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
    items: [{ productId: 1, cantidad: 1 }],
  });

  expect(deleteOrder(result.order.id)).toBe(true);
  expect(getOrderById(result.order.id)).toBeNull();
  expect(deleteOrder(9999)).toBe(false);
});
describe("Dashboard administrativo", () => {
  it("35. calcula las estadísticas iniciales", () => {
    const stats = getDashboardStats();
    const products = getProducts();
    const users = getUsers();

    expect(stats.totalProductos).toBe(products.length);
    expect(stats.totalUsuarios).toBe(users.length);
    expect(stats.totalOrdenes).toBe(0);
    expect(stats.ventasTotales).toBe(0);
    expect(stats.stockTotal).toBe(
      products.reduce((total, product) => total + product.stock, 0),
    );
    expect(stats.productosBajoStock).toEqual(
      products.filter((product) => product.stock <= 10),
    );
  });

  it("36. actualiza las estadísticas después de crear una orden", () => {
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
      items: [{ productId: 1, cantidad: 1 }],
    });

    const stats = getDashboardStats();

    expect(stats.totalOrdenes).toBe(1);
    expect(stats.ventasTotales).toBe(result.order.total);
  });
});
  });
});