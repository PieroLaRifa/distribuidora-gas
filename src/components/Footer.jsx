// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <h5><i className="bi bi-fire text-warning me-2"></i>Distribuidora de Gas</h5>
            <p className="small mb-0">Cilindros y accesorios con despacho a domicilio.</p>
          </div>
          <div className="col-6 col-md-4">
            <h6>Enlaces</h6>
            <ul className="list-unstyled small mb-0">
              <li><Link className="text-light" to="/productos">Productos</Link></li>
              <li><Link className="text-light" to="/nosotros">Nosotros</Link></li>
              <li><Link className="text-light" to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-4">
            <h6>Contacto</h6>
            <p className="small mb-0">contacto@distribuidoragas.cl<br />+56 9 0000 0000</p>
          </div>
        </div>
        <hr />
        <p className="text-center small mb-0">© {new Date().getFullYear()} Distribuidora de Gas. Proyecto académico.</p>
      </div>
    </footer>
  );
}