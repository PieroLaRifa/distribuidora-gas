
import { useState } from "react";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../../services/mockDb.js";
import { useAuth } from "../../context/AuthContext.jsx";

const emptyForm = {
  nombre: "",
  email: "",
  telefono: "",
  password: "",
  rol: "cliente",
};

export default function AdminUsers() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState(() => getUsers());
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function loadUsers() {
    setUsers(getUsers());
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleEdit(user) {
    setEditingId(user.id);
    setForm({
      nombre: user.nombre ?? "",
      email: user.email ?? "",
      telefono: user.telefono ?? "",
      password: "",
      rol: user.rol ?? "cliente",
    });
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const nombre = form.nombre.trim();
    const email = form.email.trim().toLowerCase();
    const telefono = form.telefono.trim();
    const password = form.password;

    if (!nombre || !email) {
      setError("El nombre y el correo electrónico son obligatorios.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    const duplicate = users.some(
      (item) =>
        item.email?.trim().toLowerCase() === email &&
        item.id !== editingId
    );

    if (duplicate) {
      setError("Ya existe un usuario registrado con ese correo.");
      return;
    }

    if (!editingId && password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const userData = { nombre, email, telefono, rol: form.rol };

    if (password) {
      userData.password = password;
    }

    try {
      if (editingId !== null) {
        updateUser(editingId, userData);
        setMessage("Usuario actualizado correctamente.");
      } else {
        const result = createUser(userData);

        if (result?.ok === false) {
          setError(result.error || "No se pudo crear el usuario.");
          return;
        }

        setMessage("Usuario creado correctamente.");
      }

      loadUsers();
      resetForm();
    } catch (err) {
      setError(err.message || "Ocurrió un error al guardar el usuario.");
    }
  }

  function handleDelete(userToDelete) {
    setError("");
    setMessage("");

    if (
      currentUser?.id === userToDelete.id ||
      currentUser?.email?.toLowerCase() ===
        userToDelete.email?.toLowerCase()
    ) {
      setError("No puedes eliminar tu propia cuenta desde esta pantalla.");
      return;
    }

    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar a ${userToDelete.nombre}?`
    );

    if (!confirmed) return;

    try {
      deleteUser(userToDelete.id);
      loadUsers();
      setMessage("Usuario eliminado correctamente.");

      if (editingId === userToDelete.id) {
        resetForm();
      }
    } catch (err) {
      setError(err.message || "No se pudo eliminar el usuario.");
    }
  }

  const filteredUsers = users.filter((item) => {
    const query = search.trim().toLowerCase();

    return (
      item.nombre?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query) ||
      item.rol?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h2 mb-1">Gestión de usuarios</h1>
          <p className="text-secondary mb-0">
            Administra las cuentas registradas en la distribuidora.
          </p>
        </div>

        <span className="badge text-bg-dark fs-6">
          {users.length} usuarios
        </span>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}

      <section className="card shadow-sm mb-4">
        <div className="card-header bg-white">
          <h2 className="h5 mb-0">
            {editingId !== null ? "Editar usuario" : "Registrar usuario"}
          </h2>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="nombre" className="form-label">
                  Nombre completo *
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  className="form-control"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="email" className="form-label">
                  Correo electrónico *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="telefono" className="form-label">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  className="form-control"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="rol" className="form-label">
                  Rol
                </label>
                <select
                  id="rol"
                  name="rol"
                  className="form-select"
                  value={form.rol}
                  onChange={handleChange}
                >
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="col-md-6">
                <label htmlFor="password" className="form-label">
                  Contraseña {editingId === null ? "*" : "(opcional)"}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  value={form.password}
                  onChange={handleChange}
                  minLength={6}
                  required={editingId === null}
                  autoComplete="new-password"
                  placeholder={
                    editingId !== null
                      ? "Dejar vacío para mantener la actual"
                      : "Mínimo 6 caracteres"
                  }
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary">
                {editingId !== null ? "Guardar cambios" : "Crear usuario"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetForm}
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="card shadow-sm">
        <div className="card-header bg-white">
          <h2 className="h5 mb-0">Usuarios registrados</h2>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="searchUsers" className="form-label">
              Buscar por nombre, correo o rol
            </label>
            <input
              id="searchUsers"
              className="form-control"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Escribe para filtrar..."
            />
          </div>

          {filteredUsers.length === 0 ? (
            <p className="text-secondary mb-0">
              No se encontraron usuarios.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nombre}</td>
                      <td>{item.email}</td>
                      <td>{item.telefono || "—"}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.rol === "admin"
                              ? "text-bg-dark"
                              : "text-bg-secondary"
                          }`}
                        >
                          {item.rol}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(item)}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(item)}
                            disabled={
                              currentUser?.id === item.id ||
                              currentUser?.email?.toLowerCase() ===
                                item.email?.toLowerCase()
                            }
                            title={
                              currentUser?.id === item.id
                                ? "No puedes eliminar tu propia cuenta"
                                : "Eliminar usuario"
                            }
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
