// src/App.jsx
import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PagePlaceholder from "./components/PagePlaceholder.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import Cart from "./pages/Cart.jsx";

// NOTA: en las próximas fases cada <PagePlaceholder /> se reemplaza por su página real.
export default function App() {
  return (
    <Routes>
      {/* Rutas públicas con Header y Footer */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="categorias" element={<PagePlaceholder title="Categorías" />} />
        <Route path="productos" element={<Products />} />
        <Route path="productos/:id" element={<PagePlaceholder title="Detalle de producto" />} />
        <Route path="carrito" element={<Cart />} />
        <Route path="checkout" element={<PagePlaceholder title="Checkout" />} />
        <Route path="pago-exitoso" element={<PagePlaceholder title="Pago exitoso" />} />
        <Route path="pago-rechazado" element={<PagePlaceholder title="Pago rechazado" />} />
        <Route path="nosotros" element={<PagePlaceholder title="Nosotros" />} />
        <Route path="contacto" element={<PagePlaceholder title="Contacto" />} />
        <Route path="blog" element={<PagePlaceholder title="Blog" />} />
        <Route path="login" element={<PagePlaceholder title="Iniciar sesión" />} />
        <Route path="registro" element={<PagePlaceholder title="Registro" />} />
        <Route path="*" element={<PagePlaceholder title="404 - Página no encontrada" />} />
      </Route>

      {/* Rutas de administrador (protegidas) */}
      <Route
        path="admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PagePlaceholder title="Resumen Admin" />} />
        <Route path="productos" element={<PagePlaceholder title="Admin: Productos" />} />
        <Route path="productos/nuevo" element={<PagePlaceholder title="Admin: Nuevo producto" />} />
        <Route path="productos/:id/editar" element={<PagePlaceholder title="Admin: Editar producto" />} />
        <Route path="categorias" element={<PagePlaceholder title="Admin: Categorías" />} />
        <Route path="usuarios" element={<PagePlaceholder title="Admin: Usuarios" />} />
        <Route path="ordenes" element={<PagePlaceholder title="Admin: Órdenes" />} />
      </Route>
    </Routes>
  );
}