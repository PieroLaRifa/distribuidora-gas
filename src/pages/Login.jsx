
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const resultado = login(form.email.trim(), form.password);

    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }

    navigate(resultado.user.rol === "admin" ? "/admin" : "/", {
      replace: true,
    });
  };

  return (
    <section className="container py-5">
      <div className="mx-auto" style={{ maxWidth: "480px" }}>
        <div className="card shadow-sm">
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <i
                className="bi bi-person-circle text-warning"
                style={{ fontSize: "3rem" }}
                aria-hidden="true"
              />
              <h1 className="h3 fw-bold mt-2">Iniciar sesión</h1>
              <p className="text-muted">
                Ingresa con tu cuenta para continuar.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
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

              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-warning w-100">
                Ingresar
              </button>
            </form>

            <hr />

            <p className="text-center mb-0">
              ¿No tienes una cuenta?{" "}
              <Link to="/registro">Regístrate aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
