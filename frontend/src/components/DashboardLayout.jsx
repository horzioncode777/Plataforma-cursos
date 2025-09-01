const DashboardLayout = ({ children }) => {
    return (
      <div className="dashboard">
        <aside className="sidebar">
          <img src="/assets/logo-tic.png" alt="TIC" className="logo-tic" />
          <nav className="menu">
            <Link to="/mis-cursos">Mis cursos</Link>
            <Link to="/catalogo">Catálogo</Link>
            <Link to="/de-consetic">De Consetic</Link>
            <Link to="/eventos">Eventos</Link>
          </nav>
          <div className="logos-bottom">
            <img src="/assets/logo-cajica.png" alt="Cajicá" />
            <img src="/assets/logo-ticyctei.png" alt="Secretaría TIC" />
          </div>
        </aside>
  
        <main className="main-content">
          <header className="topbar">
            <img src="/assets/logo-govco.png" alt="Gov.co" />
            <input type="text" placeholder="¿Qué quieres aprender?" />
            <Link to="/perfil" className="perfil-boton">Yo</Link>
          </header>
          {children}
        </main>
      </div>
    );
  };
  
  export default DashboardLayout;
  