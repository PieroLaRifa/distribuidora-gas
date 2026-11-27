
import { useState } from "react";
import { Link } from "react-router-dom";
import { deleteProduct, getProducts, getCategories } from "../../services/mockDb.js";

export default function AdminProducts() {
  const [productos, setProductos] = useState(() => getProducts());
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");

  const categorias = getCategories();

  const formatoPrecio = (precio) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(precio);

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  const handleDelete = (producto) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar "${producto.nombre}"?`
    );

    if (!confirmar) return;

    const eliminado = deleteProduct(producto.id);

    if (eliminado) {
      setProductos(getProducts());
      setMensaje(`Producto "${producto.nombre}" eliminado correctamente.`);
    } else {
      setMensaje("No se pudo eliminar el producto.");
    }
  };

  return (
    <section className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Gestión de productos</h1>
          <p className="text-muted mb-0">
            Administra el catálogo y el inventario.
          </p>
        </div>

        <Link to="/admin/productos/nuevo" className="btn btn-warning">
          <i className="bi bi-plus-lg me-2" aria-hidden="true" />
          Nuevo producto
        </Link>
      </div>

      {mensaje && (
        <div className="alert alert-info alert-dismissible" role="status">
          {mensaje}
          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar mensaje"
            onClick={() => setMensaje("")}
          />
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="buscarAdminProducto" className="form-label">
                Buscar por nombre
              </label>
              <input
                id="buscarAdminProducto"
                type="search"
                className="form-control"
                placeholder="Nombre del producto..."
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
              />
            </div>
            <div className="col-12 col-md-6 d-flex align-items-end">
              <span className="text-muted small">
                {productosFiltrados.length} productos encontrados
              </span>
            </div>
          </div>

          {productosFiltrados.length === 0 ? (
            <p className="text-muted py-4 text-center">
              No se encontraron productos.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th scope="col">Producto</th>
                    <th scope="col">Categoría</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Destacado</th>
                    <th scope="col" className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((producto) => {
                    const categoria = categorias.find(
                      (item) => item.id === producto.categoriaId
                    );

                    return (
                      <tr key={producto.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {producto.imagen && (
                              <img
                                src={producto.imagen}
                                alt=""
                                loading="lazy"
                                style={{
                                  width: "48px",
                                  height: "48px",
                                  objectFit: "contain",
                                }}
                              />
                            )}
                            <span className="fw-semibold">{producto.nombre}</span>
                          </div>
                        </td>
                        <td>{categoria?.nombre ?? "Sin categoría"}</td>
                        <td>{formatoPrecio(producto.precio)}</td>
                        <td>
                          <span
                            className={`badge ${
                              producto.stock <= 10
                                ? "text-bg-warning"
                                : "text-bg-success"
                            }`}
                          >
                            {producto.stock}
                          </span>
                        </td>
                        <td>
                          {producto.destacado ? "Sí" : "No"}
                        </td>
                        <td>
                          <div className="d-flex justify-content-end gap-2">
                            <Link
                              to={`/admin/productos/${producto.id}/editar`}
                              className="btn btn-sm btn-outline-primary"
                              aria-label={`Editar ${producto.nombre}`}
                            >
                              <i className="bi bi-pencil" aria-hidden="true" />
                            </Link>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              aria-label={`Eliminar ${producto.nombre}`}
                              onClick={() => handleDelete(producto)}
                            >
                              <i className="bi bi-trash" aria-hidden="true" />
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
    </section>
  );
}
