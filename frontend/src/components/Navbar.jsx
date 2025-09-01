import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./navbar.css";
import LogoAlcaldia from "/assets/Logo-Alcaldia.png";  
import ticLogo from "/assets/govco.png";  
import { FaBars, FaTimes } from "react-icons/fa"; 

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation(); // Obtiene la ruta actual

  // Oculta el Navbar en /admin-panel
  if (location.pathname === "/admin-panel") {
    return null;
  }

  // Agregar o quitar la clase al body para oscurecer la página
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [menuOpen]);

  return (
    <>
      {/* Capa oscura detrás del menú */}
      <div className={`menu-overlay ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(false)}></div>

      {/* Barra azul superior */}
      <div className="top-bar">
        <img src={ticLogo} alt="GOV.CO" className="gov-logo" />
      </div>

      {/* Navbar principal */}
      <nav className="navbar">
        <div className="nav-left">
          <img src={LogoAlcaldia} alt="TIC" className="LogoAlcaldia" />
        </div>

        {/* Icono de menú hamburguesa */}
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link></li>
          <li><Link to="/consetics" onClick={() => setMenuOpen(false)}>Consetic</Link></li>
          <li><Link to="/noticias" onClick={() => setMenuOpen(false)}>Noticias</Link></li>
          <li className="mobile-only mobile-only-button">
            <Link to="/LoginUser" onClick={() => setMenuOpen(false)} className="hamburger-login-button">
              Acceder
            </Link>
          </li>

        </ul>

        <div className="nav-right">
          <Link to="/LoginUser" className="nav-button">Acceder</Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
