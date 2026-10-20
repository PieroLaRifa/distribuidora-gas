
import { Link, useLocation } from "react-router-dom";

export default function PaymentSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  const formatoPrecio = (precio) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(precio);

  if (!order) {
    return (
      <section className="container py-5">
        <div className="text-center border rounded p-5">
          <h1 className="h3">Confirmación de pedido</h1>
          <p className="text-muted">
            No hay información de una compra reciente en esta página.
          </p>
          <Link to="/productos" className="btn btn-warning">
            Volver al catálogo
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <div className="mx-auto text-center" style={{ maxWidth: "700px" }}>
        <i
          className="bi bi-check-circle-fill text-success"
          style={{ fontSize: "5rem" }}
          aria-hidden="true"
        />

        <h1 className="display-6 fw-bold mt-3">¡Pedido registrado!</h1>
        <p className="lead">
          Tu compra simulada se registró correctamente.
        </p>

        <div className="card shadow-sm text-start my-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
              <span className="text-muted">Número de orden</span>
              <strong>{order.numeroOrden}</strong>
            </div>

            <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
              <span className="text-muted">Cliente</span>
              <strong>{order.cliente.nombre}</strong>
            </div>

            <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
              <span className="text-muted">Estado</span>
              <span className="badge text-bg-success">{order.estado}</span>
            </div>

            <hr />

            <h2 className="h5">Productos comprados</h2>

            <ul className="list-group list-group-flush">
              {order.items.map((item) => (
                <li
                  key={item.productId}
                  className="list-group-item px-0 d-flex justify-content-between gap-3"
                >
                  <span>
                    {item.nombre} × {item.cantidad}
                  </span>
                  <span className="text-nowrap">
                    {formatoPrecio(item.subtotal)}
                  </span>
                </li>
              ))}
            </ul>

            <hr />

            <div className="d-flex justify-content-between fs-5 fw-bold">
              <span>Total</span>
              <span>{formatoPrecio(order.total)}</span>
            </div>

            <p className="text-muted small mt-3 mb-0">
              No se realizó ningún cobro real. Esta orden forma parte de la
              simulación del proyecto académico.
            </p>
          </div>
        </div>

        <Link to="/productos" className="btn btn-warning btn-lg">
          Seguir comprando
        </Link>
      </div>
    </section>
  );
}
