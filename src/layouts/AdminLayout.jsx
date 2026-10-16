// src/layouts/AdminLayout.jsx
import { Outlet, Link } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar.jsx";

export default function AdminLayout() {
  return (
    <>
      <header className="bg-dark text-light py-2">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="fw-bold">
            <i className="bi bi-shield-lock text-warning me-2"></i>Panel de Administración
          </span>
          <Link to="/" className="btn btn-sm btn-outline-light">Volver a la tienda</Link>
        </div>
      </header>
      <div className="container-fluid">
        <div className="row">
          <aside className="col-12 col-lg-2 p-0">
            <AdminSidebar />
          </aside>
          <main className="col-12 col-lg-10 p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}