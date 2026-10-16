// src/components/PagePlaceholder.jsx
export default function PagePlaceholder({ title }) {
  return (
    <div className="container py-5">
      <h1 className="h3">{title}</h1>
      <p className="text-muted">Página en construcción.</p>
    </div>
  );
}