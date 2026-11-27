
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { createOrder } from "../services/mockDb.js";

const initialForm = {
  nombre: "",
  email: "",
  telefono: "",
  calle: "",
  depto: "",
  comuna: "",
  indicaciones: "",
};

export default function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState(() => ({
    ...initialForm,
    nombre: user?.nombre ?? "",
    email: user?.email ?? "",
    telefono: user?.telefono ?? "",
  }));

  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const formatoPrecio = (precio) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(precio);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Tu carrito está vacío. Agrega productos antes de continuar.");
      return;
    }

    if (
      !form.nombre.trim() ||
      !form.email.trim() ||
      !form.telefono.trim() ||
      !form.calle.trim() ||
      !form.comuna.trim()
    ) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    setEnviando(true);

    const resultado = createOrder({
      userId: user?.id ?? null,
      cliente: {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim(),
      },
      direccion: {
        calle: form.calle.trim(),
        depto: form.depto.trim(),
        comuna: form.comuna.trim(),
        indicaciones: form.indicaciones.trim(),
      },
      items: items.map((item) => ({
        productId: item.productId,
        cantidad: item.cantidad,
      })),
    });

    setEnviando(false);

    if (!resultado.ok) {
      setError(resultado.error || "No se pudo completar la compra.");
      return;
    }

    clearCart();

    navigate("/pago-exitoso", {
      state: { order: resultado.order },
      replace: true,
    });
  };

  if (items.length === 0) {
    return (
      <section className="container py-5">
        <div className="text-center border rounded p-5">
          <i
            className="bi bi-cart3 text-secondary"
            style={{ fontSize: "3rem" }}
            aria-hidden="true"
          />
          <h1 className="h3 mt-3">No hay productos para comprar</h1>
          <p className="text-muted">
            Agrega productos al carrito antes de continuar.
          </p>
          <Link to="/productos" className="btn btn-warning">
            Ir al catálogo
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <h1 className="fw-bold mb-2">Finalizar compra</h1>
      <p className="text-muted mb-4">
        Ingresa tus datos para registrar el pedido.
      </p>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h2 className="h5 fw-bold mb-3">Datos del cliente</h2>

                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombre completo *
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    className="form-control"
                    autoComplete="name"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo electrónico *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="telefono" className="form-label">
                    Teléfono *
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    className="form-control"
                    autoComplete="tel"
                    value={form.telefono}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="h5 fw-bold mb-3">Dirección de despacho</h2>

                <div className="mb-3">
                  <label htmlFor="calle" className="form-label">
                    Calle y número *
                  </label>
                  <input
                    id="calle"
                    name="calle"
                    className="form-control"
                    autoComplete="street-address"
                    value={form.calle}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label htmlFor="depto" className="form-label">
                      Departamento, casa o referencia
                    </label>
                    <input
                      id="depto"
                      name="depto"
                      className="form-control"
                      value={form.depto}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="comuna" className="form-label">
                      Comuna *
                    </label>
                    <input
                      id="comuna"
                      name="comuna"
                      className="form-control"
                      autoComplete="address-level2"
                      value={form.comuna}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="indicaciones" className="form-label">
                    Indicaciones para el despacho
                  </label>
                  <textarea
                    id="indicaciones"
                    name="indicaciones"
                    className="form-control"
                    rows="3"
                    placeholder="Ej.: casa con portón negro"
                    value={form.indicaciones}
                    onChange={handleChange}
                  />
                </div>

                <p className="text-muted small mt-3 mb-0">
                  Los campos marcados con * son obligatorios.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="h5 fw-bold mb-3">Resumen del pedido</h2>

                <ul className="list-group list-group-flush mb-3">
                  {items.map((item) => (
                    <li
                      key={item.productId}
                      className="list-group-item px-0"
                    >
                      <div className="d-flex justify-content-between gap-3">
                        <div>
                          <span className="fw-semibold">{item.nombre}</span>
                          <div className="small text-muted">
                            Cantidad: {item.cantidad}
                          </div>
                        </div>
                        <span className="text-nowrap">
                          {formatoPrecio(item.precio * item.cantidad)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="d-flex justify-content-between fs-5 fw-bold mb-3">
                  <span>Total</span>
                  <span>{formatoPrecio(subtotal)}</span>
                </div>

                <p className="text-muted small">
                  Esta compra es una simulación académica. No se realizará
                  ningún cobro real.
                </p>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-warning btn-lg"
                    disabled={enviando}
                  >
                    {enviando ? "Procesando..." : "Confirmar pedido"}
                  </button>

                  <Link to="/carrito" className="btn btn-outline-dark">
                    Volver al carrito
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
