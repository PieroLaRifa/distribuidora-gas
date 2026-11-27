
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getCategories, getProducts } from "../services/mockDb.js";
import { useCart } from "../context/CartContext.jsx";

export default function Products() {
  const [busqueda, setBusqueda] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const categoriaParam = searchParams.get("categoria") || "todas";
  const { addToCart } = useCart();

  const categorias = getCategories();
  const productos = getProducts();

  const categoriaValida =
    categoriaParam === "todas" ||
    categorias.some((categoria) => categoria.id === Number(categoriaParam));

  const categoriaSeleccionada = categoriaValida
    ? categoriaParam
    : "todas";

  const cambiarCategoria = (valor) => {
    setSearchParams((prev) => {
      const nuevosParams = new URLSearchParams(prev);

      if (valor === "todas") {
        nuevosParams.delete("categoria");
      } else {
        nuevosParams.set("categoria", valor);
      }

      return nuevosParams;
    });
  };

  const productosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return productos.filter((producto) => {
      const coincideNombre = producto.nombre.toLowerCase().includes(termino);

      const coincideCategoria =
        categoriaSeleccionada === "todas" ||
        producto.categoriaId === Number(categoriaSeleccionada);

      return coincideNombre && coincideCategoria;
    });
  }, [productos, busqueda, categoriaSeleccionada]);

  const formatoPrecio = (precio) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(precio);

  const limpiarFiltros = () => {
    setBusqueda("");
    cambiarCategoria("todas");
  };

  const categoriaActual = categorias.find(
    (categoria) => categoria.id === Number(categoriaSeleccionada)
  );

  return (
    <section className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold">Catálogo de productos</h1>
        <p className="text-muted">
          Encuentra cilindros de gas y accesorios para tu hogar o negocio.
        </p>

        {categoriaActual && (
          <p className="mb-0">
            Categoría seleccionada:{" "}
            <strong>{categoriaActual.nombre}</strong>
          </p>
        )}
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-7">
              <label htmlFor="buscarProducto" className="form-label fw-semibold">
                Buscar producto
              </label>
              <input
                id="buscarProducto"
                type="search"
                className="form-control"
                placeholder="Ej.: cilindro, regulador, manguera..."
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
              />
            </div>

            <div className="col-12 col-md-5">
              <label htmlFor="filtroCategoria" className="form-label fw-semibold">
                Categoría
              </label>
              <select
                id="filtroCategoria"
                className="form-select"
                value={categoriaSeleccionada}
                onChange={(event) => cambiarCategoria(event.target.value)}
              >
                <option value="todas">Todas las categorías</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
            <span className="text-muted small" aria-live="polite">
              {productosFiltrados.length}{" "}
              {productosFiltrados.length === 1
                ? "producto encontrado"
                : "productos encontrados"}
            </span>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={limpiarFiltros}
              disabled={busqueda === "" && categoriaSeleccionada === "todas"}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {productosFiltrados.length === 0 ? (
        <div className="alert alert-info text-center py-4">
          <h2 className="h5">No encontramos productos</h2>
          <p className="mb-3">
            Prueba con otro nombre o selecciona otra categoría.
          </p>
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={limpiarFiltros}
          >
            Mostrar todos los productos
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {productosFiltrados.map((producto) => {
            const categoria = categorias.find(
              (item) => item.id === producto.categoriaId
            );

            return (
              <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={producto.id}>
                <article className="card h-100 shadow-sm">
                  {producto.imagen ? (
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="card-img-top p-3"
                      loading="lazy"
                      style={{ height: "190px", objectFit: "contain" }}
                    />
                  ) : (
                    <div
                      className="bg-light d-flex justify-content-center align-items-center"
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
                    <span className="badge text-bg-light align-self-start mb-2">
                      {categoria?.nombre ?? "Sin categoría"}
                    </span>

                    <h2 className="h5 card-title">{producto.nombre}</h2>

                    <p className="text-muted small flex-grow-1">
                      {producto.descripcion || "Sin descripción disponible."}
                    </p>

                    <p className="fs-5 fw-bold mb-1">
                      {formatoPrecio(producto.precio)}
                    </p>

                    <p
                      className={`small mb-3 ${
                        producto.stock > 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {producto.stock > 0
                        ? `Stock disponible: ${producto.stock}`
                        : "Sin stock disponible"}
                    </p>

                    <div className="d-grid gap-2">
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
                        <i className="bi bi-cart-plus me-1" aria-hidden="true" />
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
