
import { Link } from "react-router-dom";
import { getFeaturedProducts } from "../services/mockDb.js";
import { useCart } from "../context/CartContext.jsx";

export default function Home() {
  const productos = getFeaturedProducts();
  const { addToCart } = useCart();

  const formatoPrecio = (precio) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(precio);

  return (
    <>
      <section className="bg-dark text-white py-5">
        <div className="container py-3">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <p className="text-warning fw-bold mb-2">
                DISTRIBUIDORA DE GAS
              </p>
              <h1 className="display-5 fw-bold">
                Tu gas, fácil y seguro
              </h1>
              <p className="lead">
                Encuentra cilindros y accesorios para tu hogar.
                Revisa nuestro catálogo y agrega tus productos al carrito.
              </p>
              <Link to="/productos" className="btn btn-warning btn-lg">
                Ver productos
              </Link>
            </div>

            <div className="col-lg-5 text-center">
              <i
                className="bi bi-fire text-warning"
                style={{ fontSize: "8rem" }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Productos destacados</h2>
            <p className="text-muted mb-0">
              Productos seleccionados de nuestro catálogo.
            </p>
          </div>
          <Link to="/productos" className="btn btn-outline-dark">
            Ver catálogo
          </Link>
        </div>

        {productos.length === 0 ? (
          <div className="alert alert-info">
            No hay productos destacados disponibles por el momento.
          </div>
        ) : (
          <div className="row g-4">
            {productos.map((producto) => (
              <div className="col-12 col-sm-6 col-lg-3" key={producto.id}>
                <article className="card h-100 shadow-sm">
                  {producto.imagen ? (
                    <img
                      src={producto.imagen}
                      className="card-img-top p-3"
                      alt={producto.nombre}
                      style={{ height: "190px", objectFit: "contain" }}
                    />
                  ) : (
                    <div
                      className="bg-light d-flex align-items-center justify-content-center"
                      style={{ height: "190px" }}
                    >
                      <i
                        className="bi bi-box-seam text-secondary"
                        style={{ fontSize: "4rem" }}
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  <div className="card-body d-flex flex-column">
                    <h3 className="h5 card-title">{producto.nombre}</h3>

                    <p className="text-muted small">
                      {producto.stock > 0
                        ? `Stock disponible: ${producto.stock}`
                        : "Producto sin stock"}
                    </p>

                    <p className="fs-5 fw-bold mb-3">
                      {formatoPrecio(producto.precio)}
                    </p>

                    <div className="mt-auto d-grid gap-2">
                      <Link
                        to={`/productos/${producto.id}`}
                        className="btn btn-outline-dark"
                      >
                        Ver detalle
                      </Link>

                      <button
                        type="button"
                        className="btn btn-warning"
                        disabled={producto.stock <= 0}
                        onClick={() => addToCart(producto)}
                      >
                        <i className="bi bi-cart-plus me-1" />
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
