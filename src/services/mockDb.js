// src/services/mockDb.js
// Base de datos simulada con persistencia en localStorage.
// Todas las funciones devuelven datos de forma síncrona para simplificar el uso.

const STORAGE_KEY = "distribuidora_gas_db_v1";

// ---------------------------------------------------------------------------
// DATOS INICIALES (semilla)
// ---------------------------------------------------------------------------
const seedData = {
  categories: [
    { id: 1, nombre: "Cilindros Normales", descripcion: "Cilindros de gas licuado tradicionales." },
    { id: 2, nombre: "Cilindros Catalíticos", descripcion: "Cilindros para estufas catalíticas, combustión limpia." },
    { id: 3, nombre: "Accesorios", descripcion: "Reguladores, mangueras y repuestos seguros." },
  ],

  products: [
    { id: 1, nombre: "Cilindro Normal 5 kg", categoriaId: 1, precio: 14500, stock: 40, imagen: "https://placehold.co/400x300?text=Gas+5kg", descripcion: "Ideal para estufas pequeñas y uso ocasional.", destacado: true },
    { id: 2, nombre: "Cilindro Normal 11 kg", categoriaId: 1, precio: 21500, stock: 60, imagen: "https://placehold.co/400x300?text=Gas+11kg", descripcion: "El formato más usado en hogares chilenos.", destacado: true },
    { id: 3, nombre: "Cilindro Normal 15 kg", categoriaId: 1, precio: 29000, stock: 35, imagen: "https://placehold.co/400x300?text=Gas+15kg", descripcion: "Mayor autonomía para cocina y calefón.", destacado: false },
    { id: 4, nombre: "Cilindro Normal 45 kg", categoriaId: 1, precio: 84000, stock: 12, imagen: "https://placehold.co/400x300?text=Gas+45kg", descripcion: "Formato industrial para negocios y edificios.", destacado: false },
    { id: 5, nombre: "Cilindro Catalítico 5 kg", categoriaId: 2, precio: 15500, stock: 30, imagen: "https://placehold.co/400x300?text=Catalitico+5kg", descripcion: "Para estufas catalíticas pequeñas.", destacado: false },
    { id: 6, nombre: "Cilindro Catalítico 11 kg", categoriaId: 2, precio: 22900, stock: 45, imagen: "https://placehold.co/400x300?text=Catalitico+11kg", descripcion: "Combustión más limpia para calefacción.", destacado: true },
    { id: 7, nombre: "Cilindro Catalítico 15 kg", categoriaId: 2, precio: 30500, stock: 25, imagen: "https://placehold.co/400x300?text=Catalitico+15kg", descripcion: "Gran rendimiento para temporada de invierno.", destacado: false },
    { id: 8, nombre: "Cilindro Catalítico 45 kg", categoriaId: 2, precio: 88000, stock: 8, imagen: "https://placehold.co/400x300?text=Catalitico+45kg", descripcion: "Uso comercial con sistema catalítico.", destacado: false },
    { id: 9, nombre: "Regulador de Gas Estándar", categoriaId: 3, precio: 6990, stock: 80, imagen: "https://placehold.co/400x300?text=Regulador", descripcion: "Regulador de presión compatible con cilindros domésticos.", destacado: true },
    { id: 10, nombre: "Manguera de Gas 1,5 m", categoriaId: 3, precio: 4500, stock: 100, imagen: "https://placehold.co/400x300?text=Manguera", descripcion: "Manguera flexible certificada con abrazaderas.", destacado: false },
  ],

  users: [
    // NOTA: contraseñas en texto plano SOLO porque es una simulación académica.
    { id: 1, nombre: "Administrador", email: "admin@gas.cl", password: "admin123", rol: "admin", telefono: "+56 9 1111 1111" },
    { id: 2, nombre: "Cliente Demo", email: "cliente@gas.cl", password: "cliente123", rol: "cliente", telefono: "+56 9 2222 2222" },
  ],

  orders: [],
};

// ---------------------------------------------------------------------------
// PERSISTENCIA INTERNA
// ---------------------------------------------------------------------------
const clone = (obj) => JSON.parse(JSON.stringify(obj));

function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.error("Error leyendo la base de datos simulada:", error);
  }
  const fresh = clone(seedData);
  saveDb(fresh);
  return fresh;
}

function saveDb(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (error) {
    console.error("Error guardando la base de datos simulada:", error);
  }
}

function nextId(list) {
  return list.length ? Math.max(...list.map((item) => item.id)) + 1 : 1;
}

/** Restaura los datos iniciales (útil para pruebas y para depurar). */
export function resetDb() {
  saveDb(clone(seedData));
}

// ---------------------------------------------------------------------------
// CATEGORÍAS (CRUD)
// ---------------------------------------------------------------------------
export function getCategories() {
  return loadDb().categories;
}

export function getCategoryById(id) {
  return loadDb().categories.find((c) => c.id === Number(id)) || null;
}

export function createCategory({ nombre, descripcion = "" }) {
  const db = loadDb();
  const category = { id: nextId(db.categories), nombre, descripcion };
  db.categories.push(category);
  saveDb(db);
  return category;
}

export function updateCategory(id, changes) {
  const db = loadDb();
  const index = db.categories.findIndex((c) => c.id === Number(id));
  if (index === -1) return null;
  db.categories[index] = { ...db.categories[index], ...changes, id: Number(id) };
  saveDb(db);
  return db.categories[index];
}

/** No permite eliminar una categoría que aún tiene productos asociados. */
export function deleteCategory(id) {
  const db = loadDb();
  const hasProducts = db.products.some((p) => p.categoriaId === Number(id));
  if (hasProducts) {
    return { ok: false, error: "La categoría tiene productos asociados." };
  }
  db.categories = db.categories.filter((c) => c.id !== Number(id));
  saveDb(db);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// PRODUCTOS (CRUD)
// ---------------------------------------------------------------------------
export function getProducts() {
  return loadDb().products;
}

export function getProductById(id) {
  return loadDb().products.find((p) => p.id === Number(id)) || null;
}

export function getProductsByCategory(categoriaId) {
  return loadDb().products.filter((p) => p.categoriaId === Number(categoriaId));
}

export function getFeaturedProducts() {
  return loadDb().products.filter((p) => p.destacado);
}

export function createProduct(data) {
  const db = loadDb();
  const product = {
    id: nextId(db.products),
    nombre: data.nombre,
    categoriaId: Number(data.categoriaId),
    precio: Number(data.precio),
    stock: Number(data.stock),
    imagen: data.imagen || "https://placehold.co/400x300?text=Producto",
    descripcion: data.descripcion || "",
    destacado: Boolean(data.destacado),
  };
  db.products.push(product);
  saveDb(db);
  return product;
}

export function updateProduct(id, changes) {
  const db = loadDb();
  const index = db.products.findIndex((p) => p.id === Number(id));
  if (index === -1) return null;
  const updated = { ...db.products[index], ...changes, id: Number(id) };
  updated.precio = Number(updated.precio);
  updated.stock = Number(updated.stock);
  updated.categoriaId = Number(updated.categoriaId);
  db.products[index] = updated;
  saveDb(db);
  return updated;
}

export function deleteProduct(id) {
  const db = loadDb();
  const before = db.products.length;
  db.products = db.products.filter((p) => p.id !== Number(id));
  saveDb(db);
  return db.products.length < before;
}

// ---------------------------------------------------------------------------
// USUARIOS (CRUD + autenticación simulada)
// ---------------------------------------------------------------------------
export function getUsers() {
  return loadDb().users;
}

export function getUserById(id) {
  return loadDb().users.find((u) => u.id === Number(id)) || null;
}

export function createUser({ nombre, email, password, rol = "cliente", telefono = "" }) {
  const db = loadDb();
  const exists = db.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return { ok: false, error: "Ya existe un usuario con ese correo." };
  const user = { id: nextId(db.users), nombre, email, password, rol, telefono };
  db.users.push(user);
  saveDb(db);
  return { ok: true, user };
}

export function updateUser(id, changes) {
  const db = loadDb();
  const index = db.users.findIndex((u) => u.id === Number(id));
  if (index === -1) return null;
  db.users[index] = { ...db.users[index], ...changes, id: Number(id) };
  saveDb(db);
  return db.users[index];
}

export function deleteUser(id) {
  const db = loadDb();
  const before = db.users.length;
  db.users = db.users.filter((u) => u.id !== Number(id));
  saveDb(db);
  return db.users.length < before;
}

/** Devuelve el usuario si las credenciales son correctas; si no, null. */
export function authenticate(email, password) {
  const user = loadDb().users.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password
  );
  return user || null;
}

// ---------------------------------------------------------------------------
// ÓRDENES (CRUD + creación desde el checkout)
// ---------------------------------------------------------------------------
export function getOrders() {
  return loadDb().orders;
}

export function getOrderById(id) {
  return loadDb().orders.find((o) => o.id === Number(id)) || null;
}

export function getOrdersByUser(userId) {
  return loadDb().orders.filter((o) => o.userId === Number(userId));
}

/**
 * Crea una orden a partir del carrito.
 * items: [{ productId, cantidad }]
 * cliente: { nombre, email, telefono }
 * direccion: { calle, depto, comuna, indicaciones }
 * Valida stock, calcula totales y descuenta el stock.
 */
export function createOrder({ userId = null, cliente, direccion, items }) {
  const db = loadDb();

  if (!items || items.length === 0) {
    return { ok: false, error: "El carrito está vacío." };
  }

  const detalle = [];
  for (const item of items) {
    const product = db.products.find((p) => p.id === Number(item.productId));
    if (!product) return { ok: false, error: "Producto no encontrado." };
    if (product.stock < item.cantidad) {
      return { ok: false, error: `Stock insuficiente para ${product.nombre}.` };
    }
    detalle.push({
      productId: product.id,
      nombre: product.nombre,
      precioUnitario: product.precio,
      cantidad: item.cantidad,
      subtotal: product.precio * item.cantidad,
    });
  }

  // Descontar stock
  detalle.forEach((d) => {
    const product = db.products.find((p) => p.id === d.productId);
    product.stock -= d.cantidad;
  });

  const total = detalle.reduce((acc, d) => acc + d.subtotal, 0);
  const id = nextId(db.orders);
  const order = {
    id,
    numeroOrden: `GAS-${String(id).padStart(6, "0")}`,
    userId,
    cliente,
    direccion,
    items: detalle,
    total,
    estado: "Pagada",
    fecha: new Date().toISOString(),
  };

  db.orders.push(order);
  saveDb(db);
  return { ok: true, order };
}

export function updateOrderStatus(id, estado) {
  const db = loadDb();
  const index = db.orders.findIndex((o) => o.id === Number(id));
  if (index === -1) return null;
  db.orders[index].estado = estado;
  saveDb(db);
  return db.orders[index];
}

export function deleteOrder(id) {
  const db = loadDb();
  const before = db.orders.length;
  db.orders = db.orders.filter((o) => o.id !== Number(id));
  saveDb(db);
  return db.orders.length < before;
}

// ---------------------------------------------------------------------------
// RESUMEN PARA EL DASHBOARD ADMIN
// ---------------------------------------------------------------------------
export function getDashboardStats() {
  const db = loadDb();
  return {
    totalProductos: db.products.length,
    totalUsuarios: db.users.length,
    totalOrdenes: db.orders.length,
    ventasTotales: db.orders.reduce((acc, o) => acc + o.total, 0),
    stockTotal: db.products.reduce((acc, p) => acc + p.stock, 0),
    productosBajoStock: db.products.filter((p) => p.stock <= 10),
  };
}