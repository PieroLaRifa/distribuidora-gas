
import { Link } from "react-router-dom";
import { getCategories, getProducts } from "../services/mockDb.js";

export default function Categories() {
  const categorias = getCategories();
  const productos = getProducts();

  return (
    <section className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold">Nuestras categorías</h1>
        <p className="text-muted">
          Explora nuestros cilindros de gas y accesorios por categoría.
        </p>
      </div>

      {categorias.length === 0 ? (
        <div className="alert alert-info">
          No hay categorías disponibles en este momento.
        </div>
      ) : (
        <div className="row g-4">
          {categorias.map((categoria) => {
            const cantidadProductos = productos.filter(
              (producto) => producto.categoriaId === categoria.id
            ).length;

            return (
              <div className="col-12 col-md-6 col-lg-4" key={categoria.id}>
                <article className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column p-4">
                    <div
                      className="bg-light rounded d-flex align-items-center justify-content-center mb-3"
                      style={{ height: "110px" }}
                    >
                      <i
                        className="bi bi-grid text-warning"
                        style={{ fontSize: "3.5rem" }}
                        aria-hidden="true"
                      />
                    </div>

                    <h2 className="h4">{categoria.nombre}</h2>

                    <p className="text-muted flex-grow-1">
                      {categoria.descripcion || "Explora los productos de esta categoría."}
                    </p>

                    <p className="small text-secondary">
                      {cantidadProductos}{" "}
                      {cantidadProductos === 1 ? "producto" : "productos"}
                    </p>

                    <Link
                      to={`/productos?categoria=${categoria.id}`}
                      className="btn btn-warning"
                    >
                      Ver productos
                      <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-5 text-center">
        <Link to="/productos" className="btn btn-outline-dark">
          Ver catálogo completo
        </Link>
      </div>
    </section>
  );
}
