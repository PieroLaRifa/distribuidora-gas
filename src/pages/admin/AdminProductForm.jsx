
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createProduct,
  getCategories,
  getProductById,
  updateProduct,
} from "../../services/mockDb.js";

const initialForm = {
  nombre: "",
  categoriaId: "",
  precio: "",
  stock: "",
  imagen: "",
  descripcion: "",
  destacado: false,
};

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  // Obtener el producto antes de inicializar los estados.
  const productoInicial = editando ? getProductById(id) : null;
  const productoNoEncontrado = editando && !productoInicial;

  const [form, setForm] = useState(() => {
    if (!productoInicial) return initialForm;

    return {
      nombre: productoInicial.nombre ?? "",
      categoriaId: String(productoInicial.categoriaId ?? ""),
      precio: String(productoInicial.precio ?? ""),
      stock: String(productoInicial.stock ?? ""),
      imagen: productoInicial.imagen ?? "",
      descripcion: productoInicial.descripcion ?? "",
      destacado: Boolean(productoInicial.destacado),
    };
  });

  const [error, setError] = useState(
    productoNoEncontrado
      ? "No se encontró el producto que deseas editar."
      : ""
  );

  const categorias = getCategories();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const nombre = form.nombre.trim();
    const precio = Number(form.precio);
    const stock = Number(form.stock);
    const categoriaId = Number(form.categoriaId);

    if (!nombre) {
      setError("El nombre del producto es obligatorio.");
      return;
    }

    if (!Number.isFinite(precio) || precio <= 0) {
      setError("El precio debe ser un número mayor que cero.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("El stock debe ser un número entero igual o mayor que cero.");
      return;
    }

    if (!categorias.some((categoria) => categoria.id === categoriaId)) {
      setError("Selecciona una categoría válida.");
      return;
    }

    const datos = {
      nombre,
      categoriaId,
      precio,
      stock,
      imagen: form.imagen.trim(),
      descripcion: form.descripcion.trim(),
      destacado: form.destacado,
    };

    if (editando) {
      const actualizado = updateProduct(id, datos);

      if (!actualizado) {
        setError("No se pudo actualizar el producto.");
        return;
      }
    } else {
      createProduct(datos);
    }

    navigate("/admin/productos", { replace: true });
  };

  return (
    <section className="container-fluid py-4">
      <div className="mb-4">
        <Link to="/admin/productos" className="text-decoration-none">
          <i className="bi bi-arrow-left me-2" aria-hidden="true" />
          Volver a productos
        </Link>

        <h1 className="h3 fw-bold mt-3">
          {editando ? "Editar producto" : "Crear producto"}
        </h1>

        <p className="text-muted">
          Completa los datos del producto del catálogo.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!productoNoEncontrado && (
        <div className="card shadow-sm" style={{ maxWidth: "850px" }}>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre *
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  className="form-control"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label htmlFor="categoriaId" className="form-label">
                    Categoría *
                  </label>
                  <select
                    id="categoriaId"
                    name="categoriaId"
                    className="form-select"
                    value={form.categoriaId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="precio" className="form-label">
                    Precio en CLP *
                  </label>
                  <input
                    id="precio"
                    name="precio"
                    type="number"
                    className="form-control"
                    min="1"
                    step="1"
                    value={form.precio}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label htmlFor="stock" className="form-label">
                    Stock *
                  </label>
                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    className="form-control"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="imagen" className="form-label">
                    URL de imagen
                  </label>
                  <input
                    id="imagen"
                    name="imagen"
                    type="url"
                    className="form-control"
                    placeholder="https://..."
                    value={form.imagen}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  className="form-control"
                  rows="4"
                  value={form.descripcion}
                  onChange={handleChange}
                />
              </div>

              <div className="form-check mb-4">
                <input
                  id="destacado"
                  name="destacado"
                  type="checkbox"
                  className="form-check-input"
                  checked={form.destacado}
                  onChange={handleChange}
                />
                <label htmlFor="destacado" className="form-check-label">
                  Mostrar como producto destacado
                </label>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <button type="submit" className="btn btn-warning">
                  {editando ? "Guardar cambios" : "Crear producto"}
                </button>

                <Link
                  to="/admin/productos"
                  className="btn btn-outline-secondary"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
