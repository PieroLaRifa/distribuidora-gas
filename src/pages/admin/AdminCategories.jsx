
import { useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getProducts,
  updateCategory,
} from "../../services/mockDb.js";

const formularioInicial = { nombre: "", descripcion: "" };

export default function AdminCategories() {
  const [categorias, setCategorias] = useState(() => getCategories());
  const [productos, setProductos] = useState(() => getProducts());
  const [form, setForm] = useState(formularioInicial);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const recargarDatos = () => {
    setCategorias(getCategories());
    setProductos(getProducts());
  };

  const limpiarFormulario = () => {
    setForm(formularioInicial);
    setEditandoId(null);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setMensaje("");

    const nombre = form.nombre.trim();
    const descripcion = form.descripcion.trim();

    if (!nombre) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }

    const duplicada = categorias.some(
      (categoria) =>
        categoria.nombre.toLowerCase() === nombre.toLowerCase() &&
        categoria.id !== editandoId
    );

    if (duplicada) {
      setError("Ya existe una categoría con ese nombre.");
      return;
    }

    if (editandoId !== null) {
      const actualizada = updateCategory(editandoId, {
        nombre,
        descripcion,
      });

      if (!actualizada) {
        setError("No se pudo actualizar la categoría.");
        return;
      }

      setMensaje("Categoría actualizada correctamente.");
    } else {
      createCategory({ nombre, descripcion });
      setMensaje("Categoría creada correctamente.");
    }

    recargarDatos();
    limpiarFormulario();
  };

  const iniciarEdicion = (categoria) => {
    setEditandoId(categoria.id);
    setForm({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || "",
    });
    setError("");
    setMensaje("");
  };

  const handleDelete = (categoria) => {
    const cantidadProductos = productos.filter(
      (producto) => producto.categoriaId === categoria.id
    ).length;

    if (
      !window.confirm(
        `¿Eliminar la categoría "${categoria.nombre}"?`
      )
    ) {
      return;
    }

    const resultado = deleteCategory(categoria.id);

    if (!resultado.ok) {
      setError(
        resultado.error ||
          `No se puede eliminar: tiene ${cantidadProductos} productos asociados.`
      );
      setMensaje("");
      return;
    }

    if (editandoId === categoria.id) limpiarFormulario();

    recargarDatos();
    setMensaje("Categoría eliminada correctamente.");
    setError("");
  };

  return (
    <section className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 fw-bold">Gestión de categorías</h1>
        <p className="text-muted">
          Administra las categorías del catálogo de productos.
        </p>
      </div>

      {mensaje && (
        <div className="alert alert-success" role="status">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 fw-bold mb-3">
                {editandoId !== null
                  ? "Editar categoría"
                  : "Crear categoría"}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombreCategoria" className="form-label">
                    Nombre *
                  </label>
                  <input
                    id="nombreCategoria"
                    name="nombre"
                    className="form-control"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="descripcionCategoria"
                    className="form-label"
                  >
                    Descripción
                  </label>
                  <textarea
                    id="descripcionCategoria"
                    name="descripcion"
                    className="form-control"
                    rows="4"
                    value={form.descripcion}
                    onChange={handleChange}
                  />
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <button type="submit" className="btn btn-warning">
                    {editandoId !== null
                      ? "Guardar cambios"
                      : "Crear categoría"}
                  </button>

                  {editandoId !== null && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={limpiarFormulario}
                    >
                      Cancelar edición
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 fw-bold mb-3">
                Categorías registradas ({categorias.length})
              </h2>

              {categorias.length === 0 ? (
                <p className="text-muted">
                  Todavía no hay categorías registradas.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th scope="col">Categoría</th>
                        <th scope="col">Productos</th>
                        <th scope="col" className="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categorias.map((categoria) => {
                        const cantidad = productos.filter(
                          (producto) =>
                            producto.categoriaId === categoria.id
                        ).length;

                        return (
                          <tr key={categoria.id}>
                            <td>
                              <strong>{categoria.nombre}</strong>
                              <div className="small text-muted">
                                {categoria.descripcion || "Sin descripción"}
                              </div>
                            </td>
                            <td>{cantidad}</td>
                            <td>
                              <div className="d-flex justify-content-end gap-2">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => iniciarEdicion(categoria)}
                                  aria-label={`Editar ${categoria.nombre}`}
                                >
                                  <i
                                    className="bi bi-pencil"
                                    aria-hidden="true"
                                  />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(categoria)}
                                  aria-label={`Eliminar ${categoria.nombre}`}
                                >
                                  <i
                                    className="bi bi-trash"
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
