// src/components/Header.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const { totalItems } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="bi bi-fire text-warning me-2"></i>
            Distribuidora de Gas
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menuPrincipal"
            aria-controls="menuPrincipal"
            aria-expanded="false"
            aria-label="Abrir menú"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="menuPrincipal">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><NavLink className="nav-link" to="/" end>Inicio</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/productos">Productos</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/categorias">Categorías</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/nosotros">Nosotros</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/blog">Blog</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/contacto">Contacto</NavLink></li>
            </ul>

            <div className="d-flex align-items-center gap-2">
              <Link to="/carrito" className="btn btn-outline-light position-relative" aria-label="Carrito">
                <i className="bi bi-cart3"></i>
                {totalItems > 0 && (
                  <span className="badge rounded-pill bg-warning text-dark position-absolute top-0 start-100 translate-middle">
                    {totalItems}
                  </span>
                )}
              </Link>

              {isAdmin && (
                <Link to="/admin" className="btn btn-warning">Admin</Link>
              )}

              {user ? (
                <>
                  <span className="text-light small d-none d-lg-inline">Hola, {user.nombre}</span>
                  <button className="btn btn-outline-light" onClick={handleLogout}>Salir</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline-light">Ingresar</Link>
                  <Link to="/registro" className="btn btn-warning">Registrarse</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}