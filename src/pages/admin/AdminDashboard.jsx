
import { Link } from "react-router-dom";
import { getDashboardStats } from "../../services/mockDb.js";

export default function AdminDashboard() {
  const stats = getDashboardStats();

  const formatoPrecio = (precio) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(precio);

  const indicadores = [
    {
      titulo: "Productos",
      valor: stats.totalProductos,
      icono: "bi-box-seam",
      color: "text-primary",
      destino: "/admin/productos",
    },
    {
      titulo: "Usuarios",
      valor: stats.totalUsuarios,
      icono: "bi-people",
      color: "text-success",
      destino: "/admin/usuarios",
    },
    {
      titulo: "Órdenes",
      valor: stats.totalOrdenes,
      icono: "bi-receipt",
      color: "text-warning",
      destino: "/admin/ordenes",
    },
    {
      titulo: "Ventas registradas",
      valor: formatoPrecio(stats.ventasTotales),
      icono: "bi-currency-dollar",
      color: "text-info",
      destino: "/admin/ordenes",
    },
  ];

  return (
    <section className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 fw-bold">Panel de administración</h1>
        <p className="text-muted mb-0">
          Resumen general de Distribuidora de Gas.
        </p>
      </div>

      <div className="row g-3 mb-4">
        {indicadores.map((indicador) => (
          <div className="col-12 col-sm-6 col-xl-3" key={indicador.titulo}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <p className="text-muted mb-2">{indicador.titulo}</p>
                    <p className="h3 fw-bold mb-0">{indicador.valor}</p>
                  </div>
                  <i
                    className={`bi ${indicador.icono} ${indicador.color}`}
                    style={{ fontSize: "2rem" }}
                    aria-hidden="true"
                  />
                </div>

                <Link
                  to={indicador.destino}
                  className="small d-inline-block mt-3"
                >
                  Ver detalles
                  <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="h5 fw-bold">Inventario</h2>
              <p className="text-muted">Unidades registradas en el catálogo.</p>
              <p className="display-6 fw-bold">{stats.stockTotal}</p>

              <Link to="/admin/productos" className="btn btn-outline-dark">
                Gestionar productos
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <h2 className="h5 fw-bold mb-0">Productos con bajo stock</h2>
                <span className="badge text-bg-warning">
                  {stats.productosBajoStock.length}
                </span>
              </div>

              {stats.productosBajoStock.length === 0 ? (
                <p className="text-muted mb-0">
                  No hay productos con bajo stock.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Producto</th>
                        <th scope="col" className="text-end">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.productosBajoStock.map((producto) => (
                        <tr key={producto.id}>
                          <td>{producto.nombre}</td>
                          <td className="text-end">
                            <span className="badge text-bg-warning">
                              {producto.stock}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <Link
                to="/admin/productos"
                className="btn btn-outline-dark mt-3"
              >
                Revisar inventario
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
