
import { useEffect, useState } from "react";
import {
  deleteOrder,
  getOrders,
  updateOrderStatus,
} from "../../services/mockDb.js";

const ORDER_STATUSES = [
  "Pagada",
  "Preparando",
  "En despacho",
  "Entregada",
  "Cancelada",
];

const currency = (amount) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? "Fecha inválida"
    : parsed.toLocaleString("es-CL");
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todas");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function loadOrders() {
    setOrders(getOrders());
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function handleStatusChange(order, newStatus) {
    setError("");
    setMessage("");

    const updated = updateOrderStatus(order.id, newStatus);

    if (!updated) {
      setError("No se encontró la orden que intentas actualizar.");
      return;
    }

    loadOrders();

    if (selectedOrder?.id === order.id) {
      setSelectedOrder(updated);
    }

    setMessage(`La orden ${order.numeroOrden} ahora está: ${newStatus}.`);
  }

  function handleDelete(order) {
    setError("");
    setMessage("");

    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar la orden ${order.numeroOrden}?`
    );

    if (!confirmed) return;

    const deleted = deleteOrder(order.id);

    if (!deleted) {
      setError("No se pudo eliminar la orden.");
      return;
    }

    if (selectedOrder?.id === order.id) {
      setSelectedOrder(null);
    }

    loadOrders();
    setMessage(`Orden ${order.numeroOrden} eliminada.`);
  }

  const filteredOrders = orders.filter((order) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      String(order.numeroOrden ?? "").toLowerCase().includes(query) ||
      String(order.cliente?.nombre ?? "").toLowerCase().includes(query) ||
      String(order.cliente?.email ?? "").toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "Todas" || order.estado === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h2 mb-1">Gestión de órdenes</h1>
          <p className="text-secondary mb-0">
            Consulta las compras y actualiza el estado de los pedidos.
          </p>
        </div>

        <span className="badge text-bg-dark fs-6">
          {orders.length} órdenes
        </span>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}

      <section className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <label htmlFor="orderSearch" className="form-label">
                Buscar orden o cliente
              </label>
              <input
                id="orderSearch"
                className="form-control"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ej.: GAS-000001 o correo del cliente"
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="orderStatus" className="form-label">
                Filtrar por estado
              </label>
              <select
                id="orderStatus"
                className="form-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="Todas">Todos los estados</option>
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm">
        <div className="card-body">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-4">
              <h2 className="h5">No hay órdenes para mostrar</h2>
              <p className="text-secondary mb-0">
                Cuando se realice una compra, aparecerá aquí.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead>
                  <tr>
                    <th>N.º orden</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="fw-semibold">{order.numeroOrden}</td>
                      <td>
                        <div>{order.cliente?.nombre || "Sin nombre"}</div>
                        <small className="text-secondary">
                          {order.cliente?.email || ""}
                        </small>
                      </td>
                      <td>{formatDate(order.fecha)}</td>
                      <td>{currency(order.total)}</td>
                      <td>
                        <select
                          aria-label={`Estado de ${order.numeroOrden}`}
                          className="form-select form-select-sm"
                          value={ORDER_STATUSES.includes(order.estado)
                            ? order.estado
                            : "Pagada"}
                          onChange={(event) =>
                            handleStatusChange(order, event.target.value)
                          }
                        >
                          {!ORDER_STATUSES.includes(order.estado) && (
                            <option value={order.estado}>
                              {order.estado}
                            </option>
                          )}
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setSelectedOrder(order)}
                          >
                            Detalle
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(order)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {selectedOrder && (
        <section className="card shadow-sm mt-4">
          <div className="card-header bg-white d-flex justify-content-between align-items-center gap-2">
            <h2 className="h5 mb-0">
              Detalle de {selectedOrder.numeroOrden}
            </h2>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setSelectedOrder(null)}
            >
              Cerrar
            </button>
          </div>

          <div className="card-body">
            <p>
              <strong>Cliente:</strong>{" "}
              {selectedOrder.cliente?.nombre || "Sin nombre"}
            </p>
            <p>
              <strong>Correo:</strong>{" "}
              {selectedOrder.cliente?.email || "No registrado"}
            </p>
            <p>
              <strong>Fecha:</strong> {formatDate(selectedOrder.fecha)}
            </p>
            <p>
              <strong>Dirección:</strong>{" "}
              {[
                selectedOrder.direccion?.calle,
                selectedOrder.direccion?.depto,
                selectedOrder.direccion?.comuna,
              ]
                .filter(Boolean)
                .join(", ") || "No registrada"}
            </p>

            <h3 className="h6 mt-4">Productos comprados</h3>

            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio unitario</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrder.items ?? []).map((item, index) => (
                    <tr key={`${item.productId}-${index}`}>
                      <td>{item.nombre}</td>
                      <td>{currency(item.precioUnitario)}</td>
                      <td>{item.cantidad}</td>
                      <td>{currency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={3} className="text-end">
                      Total
                    </th>
                    <th>{currency(selectedOrder.total)}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
