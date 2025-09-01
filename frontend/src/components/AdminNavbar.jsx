import { Link } from "react-router-dom";
import "./adminNavbar.css";
import { FaSignOutAlt } from "react-icons/fa";  

function AdminNavbar({ onLogout }) {
  return (
    <nav className="admin-navbar">
      <div className="admin-logo">
        <img src="/assets/Logo-Alcaldia.png" alt="TIC" className="LogoAlcaldia" />
      </div>
      <ul className="admin-nav-links">
        <li><Link to="/admin">Panel</Link></li>
        <li><Link to="/admin/AdminUsuarios">Usuarios</Link></li>
        <li><Link to="/admin/AdminConsetics">ConseTic</Link></li>
        <li><Link to="/admin/adminNoticias">Noticias</Link></li>
      </ul>
      {/* Botón de Cerrar Sesión con la función `onLogout` */}
      <button className="logout-button" onClick={onLogout}>
        <FaSignOutAlt /> Cerrar Sesión
      </button>
    </nav>
  );
}

export default AdminNavbar;
