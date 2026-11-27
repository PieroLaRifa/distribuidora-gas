
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    confirmarPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (form.password !== form.confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const resultado = register({
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      telefono: form.telefono.trim(),
      password: form.password,
    });

    if (!resultado.ok) {
      setError(resultado.error || "No se pudo crear la cuenta.");
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <section className="container py-5">
      <div className="mx-auto" style={{ maxWidth: "520px" }}>
        <div className="card shadow-sm">
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <i
                className="bi bi-person-plus text-warning"
                style={{ fontSize: "3rem" }}
                aria-hidden="true"
              />
              <h1 className="h3 fw-bold mt-2">Crear cuenta</h1>
              <p className="text-muted">
                Regístrate para acceder a tu cuenta de cliente.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre completo
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
                  Correo electrónico
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

              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">
                  Teléfono
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

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  autoComplete="new-password"
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <div className="form-text">Mínimo 6 caracteres.</div>
              </div>

              <div className="mb-4">
                <label htmlFor="confirmarPassword" className="form-label">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmarPassword"
                  name="confirmarPassword"
                  type="password"
                  className="form-control"
                  autoComplete="new-password"
                  value={form.confirmarPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-warning w-100">
                Crear cuenta
              </button>
            </form>

            <hr />

            <p className="text-center mb-0">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
