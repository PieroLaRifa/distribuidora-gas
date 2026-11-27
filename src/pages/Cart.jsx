
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
  } = useCart();

  const formatoPrecio = (precio) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(precio);

  return (
    <section className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold">Mi carrito</h1>
        <p className="text-muted">
          Revisa tus productos antes de continuar con la compra.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-5 border rounded">
          <i
            className="bi bi-cart3 text-secondary"
            style={{ fontSize: "4rem" }}
            aria-hidden="true"
          />
          <h2 className="h4 mt-3">Tu carrito está vacío</h2>
          <p className="text-muted">
            Explora nuestro catálogo para encontrar lo que necesitas.
          </p>
          <Link to="/productos" className="btn btn-warning">
            Ver productos
          </Link>
        </div>
      ) : (
        <>
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 mb-0">
                  Productos ({items.reduce((total, item) => total + item.cantidad, 0)})
                </h2>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={clearCart}
                >
                  Vaciar carrito
                </button>
              </div>

              <div className="d-flex flex-column gap-3">
                {items.map((item) => (
                  <article className="card shadow-sm" key={item.productId}>
                    <div className="card-body">
                      <div className="row align-items-center g-3">
                        <div className="col-4 col-md-3">
                          {item.imagen ? (
                            <img
                              src={item.imagen}
                              alt={item.nombre}
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: "120px",
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            <div
                              className="bg-light rounded d-flex align-items-center justify-content-center"
                              style={{ height: "120px" }}
                            >
                              <i
                                className="bi bi-box-seam fs-1 text-secondary"
                                aria-hidden="true"
                              />
                            </div>
                          )}
                        </div>

                        <div className="col-8 col-md-9">
                          <div className="d-flex justify-content-between gap-2">
                            <div>
                              <h3 className="h6 fw-bold">{item.nombre}</h3>
                              <p className="text-muted small mb-2">
                                Precio unitario: {formatoPrecio(item.precio)}
                              </p>
                            </div>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger align-self-start"
                              aria-label={`Eliminar ${item.nombre} del carrito`}
                              onClick={() => removeFromCart(item.productId)}
                            >
                              <i className="bi bi-trash" aria-hidden="true" />
                            </button>
                          </div>

                          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3">
                            <div>
                              <label
                                className="form-label small mb-1"
                                htmlFor={`cantidad-${item.productId}`}
                              >
                                Cantidad
                              </label>
                              <input
                                id={`cantidad-${item.productId}`}
                                type="number"
                                className="form-control"
                                style={{ width: "100px" }}
                                min="1"
                                max={item.stock}
                                value={item.cantidad}
                                onChange={(event) => {
                                  const cantidad = Number(event.target.value);
                                  if (
                                    Number.isInteger(cantidad) &&
                                    cantidad >= 1 &&
                                    cantidad <= item.stock
                                  ) {
                                    updateQuantity(item.productId, cantidad);
                                  }
                                }}
                              />
                              <small className="text-muted">
                                Stock: {item.stock}
                              </small>
                            </div>

                            <div className="text-end">
                              <span className="small text-muted d-block">
                                Subtotal
                              </span>
                              <strong>
                                {formatoPrecio(item.precio * item.cantidad)}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h2 className="h5 fw-bold mb-4">Resumen de compra</h2>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Productos</span>
                    <span>
                      {items.reduce((total, item) => total + item.cantidad, 0)}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Subtotal</span>
                    <span>{formatoPrecio(subtotal)}</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between fs-5 fw-bold mb-4">
                    <span>Total</span>
                    <span>{formatoPrecio(subtotal)}</span>
                  </div>

                  <p className="text-muted small">
                    El despacho, si corresponde, no está incluido en este subtotal.
                  </p>

                  <div className="d-grid gap-2">
                    <Link to="/checkout" className="btn btn-warning btn-lg">
                      Continuar compra
                    </Link>
                    <Link to="/productos" className="btn btn-outline-dark">
                      Seguir comprando
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
