// src/components/AdminSidebar.jsx
import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin", label: "Resumen", icon: "bi-speedometer2", end: true },
  { to: "/admin/productos", label: "Productos", icon: "bi-box-seam" },
  { to: "/admin/categorias", label: "Categorías", icon: "bi-tags" },
  { to: "/admin/usuarios", label: "Usuarios", icon: "bi-people" },
  { to: "/admin/ordenes", label: "Órdenes", icon: "bi-receipt" },
];

export default function AdminSidebar() {
  return (
    <nav className="nav nav-pills flex-lg-column gap-1 p-3 bg-light h-100">
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} end={l.end} className="nav-link">
          <i className={`bi ${l.icon} me-2`}></i>
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}