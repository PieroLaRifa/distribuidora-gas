
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById, getCategories } from "../services/mockDb.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const producto = getProductById(id);
  const categorias = getCategories();
  const { addToCart } = useCart();
  const [mensaje, setMensaje] = useState("");

  const formatoPrecio = (precio) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(precio);

  if (!producto) {
    return (
      <section className="container py-5">
        <div className="alert alert-warning">
          <h1 className="h4">Producto no encontrado</h1>
          <p>El producto que buscas no existe o ya no está disponible.</p>
          <Link to="/productos" className="btn btn-dark">
            Volver al catálogo
          </Link>
        </div>
      </section>
    );
  }

  const categoria = categorias.find(
    (item) => item.id === producto.categoriaId
  );

  const handleAddToCart = () => {
    if (producto.stock <= 0) return;

    addToCart(producto);
    setMensaje("Producto agregado al carrito.");
  };

  return (
    <section className="container py-5">
      <nav aria-label="Ruta de navegación" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Inicio</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/productos">Productos</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {producto.nombre}
          </li>
        </ol>
      </nav>

      <div className="row g-5 align-items-start">
        <div className="col-12 col-md-6">
          <div className="border rounded p-3 bg-white">
            {producto.imagen ? (
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="img-fluid d-block mx-auto"
                style={{
                  width: "100%",
                  height: "380px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div
                className="d-flex justify-content-center align-items-center bg-light"
                style={{ height: "380px" }}
              >
                <i
                  className="bi bi-box-seam text-secondary"
                  style={{ fontSize: "6rem" }}
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-md-6">
          {categoria && (
            <span className="badge text-bg-light mb-3">
              {categoria.nombre}
            </span>
          )}

          <h1 className="display-6 fw-bold">{producto.nombre}</h1>

          <p className="fs-3 fw-bold my-3">
            {formatoPrecio(producto.precio)}
          </p>

          <p className={producto.stock > 0 ? "text-success" : "text-danger"}>
            <i
              className={`bi ${
                producto.stock > 0 ? "bi-check-circle" : "bi-x-circle"
              } me-2`}
              aria-hidden="true"
            />
            {producto.stock > 0
              ? `${producto.stock} unidades disponibles`
              : "Producto sin stock"}
          </p>

          <hr />

          <h2 className="h5">Descripción</h2>
          <p className="text-muted">
            {producto.descripcion || "Sin descripción disponible."}
          </p>

          {producto.destacado && (
            <p>
              <span className="badge text-bg-warning">
                Producto destacado
              </span>
            </p>
          )}

          {mensaje && (
            <div className="alert alert-success" role="status">
              {mensaje}{" "}
              <Link to="/carrito" className="alert-link">
                Ver carrito
              </Link>
            </div>
          )}

          <div className="d-grid gap-2 mt-4">
            <button
              type="button"
              className="btn btn-warning btn-lg"
              disabled={producto.stock <= 0}
              onClick={handleAddToCart}
            >
              <i className="bi bi-cart-plus me-2" aria-hidden="true" />
              Agregar al carrito
            </button>

            <Link to="/productos" className="btn btn-outline-dark">
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
