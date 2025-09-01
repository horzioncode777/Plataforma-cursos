import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PerfilUsuario.css";
import MisCursos from "./MisCursos";
import Catalogo from "./Catalogo";
import ticLogo from "/assets/govco.png";

const PerfilUsuario = () => {
  const navigate = useNavigate();
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [panelActivo, setPanelActivo] = useState("catalogo");
  const [busqueda, setBusqueda] = useState("");
  const [user, setUser] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    imagenPerfil: "",
    tipoDocumento: "",
    numeroDocumento: "",
    fechaNacimiento: "",
    genero: "",
    municipio: "",
    misCursos: [],
  });
  const [nuevaFoto, setNuevaFoto] = useState(null);
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(true);

  const mapCitizenToUser = (data) => ({
    nombre: data.nombre,
    apellido: data.apellido,
    email: data.email,
    telefono: data.telefono,
    tipoDocumento: data.tipoDocumento,
    numeroDocumento: data.numeroDocumento,
    fechaNacimiento: data.fechaNacimiento?.split("T")[0] || "",
    genero: data.genero,
    municipio: data.municipio,
    imagenPerfil: data.fotoPerfil?.replace(/.*[\\/]/, "") || "",
    misCursos: data.misCursos || [],
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/loginUser");

        const { data } = await axios.get("http://localhost:5000/api/citizen/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(mapCitizenToUser(data));
        setCargando(false);
      } catch (err) {
        console.error("Error al obtener datos del usuario", err);
        setCargando(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/modulos/cerrar-acceso", {
        withCredentials: true,
      });
      localStorage.removeItem("token");
      setTimeout(() => {
        navigate("/loginUser", { replace: true });
        window.location.reload();
      }, 100);
    } catch (err) {
      console.error("Error al cerrar sesión", err);
      setMensaje("Hubo un error al cerrar la sesión.");
    }
  };

  const handleCambiarContraseña = () => {
    navigate("/forgot-password");
  };

  const handleActualizarDatos = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!user.nombre || !user.apellido || !user.telefono || !user.numeroDocumento) {
      setMensaje("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nombre", user.nombre);
      formData.append("apellido", user.apellido);
      formData.append("tipoDocumento", user.tipoDocumento);
      formData.append("numeroDocumento", user.numeroDocumento);
      formData.append("fechaNacimiento", user.fechaNacimiento);
      formData.append("genero", user.genero);
      formData.append("municipio", user.municipio);
      formData.append("telefono", user.telefono);
      if (nuevaFoto) formData.append("fotoPerfil", nuevaFoto);

      const { data } = await axios.put("http://localhost:5000/api/citizen/perfil", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMensaje("Datos actualizados correctamente.");
      setEditando(false);
      setUser(mapCitizenToUser(data.citizen));
    } catch (err) {
      console.error("Error al actualizar los datos", err);
      setMensaje("Hubo un error al actualizar los datos.");
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleEnrollCourse = async (course) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/citizen/inscribir", { courseId: course._id }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser((prevState) => ({
        ...prevState,
        misCursos: [...prevState.misCursos, course],
      }));

      setMensaje(`Inscripción exitosa en el curso: ${course.title}`);
    } catch (err) {
      console.error("Error al inscribirse al curso", err);
      setMensaje("Hubo un error al inscribirse al curso.");
    }
  };

  if (cargando) return <div>Cargando...</div>;

  return (
    <div className="perfil-container">
      <header className="perfil-header">
        <img src={ticLogo} className="gov-logo" alt="Logo GOV.CO" />
      </header>

      <div className="perfil-body">
        <aside className="sidebar">
          <img src="/assets/Logo-Alcaldia.png" alt="Logo Alcaldía" className="LogoAlcaldia" />
          <nav className="sidebar-nav">
            <button className="sidebar-btn" onClick={() => setPanelActivo("mis-cursos")}>Mis cursos</button>
            <button className="sidebar-btn" onClick={() => setPanelActivo("catalogo")}>Catálogo</button>
          </nav>
          <div className="sidebar-footer">
            <img src="/assets/AlcaldiaCTEI.png" alt="CTEI" />
          </div>
        </aside>

        <main className="contenido">
          <div className="panel-busqueda">
            <div className="buscador">
              <span className="icono-busqueda">🔍</span>
              <input
                type="text"
                placeholder="¿Qué quieres aprender?"
                className="input-busqueda"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="perfil-usuario" onClick={() => setMostrarMenu(!mostrarMenu)}>
              <img
                src={user.imagenPerfil ? `http://localhost:5000/uploads/perfiles/${user.imagenPerfil}?t=${Date.now()}` : "/assets/Usuario.png"}
                alt="avatar"
                className="imagen-perfil"
              />
              {mostrarMenu && (
                <div className="menu-desplegable">
                  <p className="correo-usuario">{user.email}</p>
                  <div className="avatar-wrapper">
                    <img
                      src={user.imagenPerfil ? `http://localhost:5000/uploads/perfiles/${user.imagenPerfil}?t=${Date.now()}` : "/assets/Usuario.png"}
                      alt="avatar"
                    />
                  </div>
                  <p className="saludo">¡Hola, {user.nombre} {user.apellido}!</p>
                  <button className="btn-perfil btn-primario" onClick={() => setEditando(true)}>Actualizar cuenta</button>
                  <hr />
                  <button className="btn-perfil" onClick={handleCambiarContraseña}>Cambiar contraseña</button>
                  <button className="btn-perfil" onClick={handleLogout}>Cerrar Sesión</button>
                  {mensaje && <p className="mensaje">{mensaje}</p>}
                </div>
              )}
            </div>
          </div>
        </main>

        <div className="contenedor-panel">
          {panelActivo === "mis-cursos" && <MisCursos busqueda={busqueda} />}
          {panelActivo === "catalogo" && <Catalogo busqueda={busqueda} handleEnrollCourse={handleEnrollCourse} />}
        </div>
      </div>

      {editando && (
        <div className="overlay">
          <div className="modal">
            <button className="cerrar-modal" onClick={() => setEditando(false)}>✖</button>
            <h3>Actualizar Datos</h3>
            <form onSubmit={handleActualizarDatos}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input type="text" name="nombre" value={user.nombre} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="apellido">Apellido</label>
                <input type="text" name="apellido" value={user.apellido} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input type="text" name="telefono" value={user.telefono} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="numeroDocumento">Número de Documento</label>
                <input type="text" name="numeroDocumento" value={user.numeroDocumento} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                <input type="date" name="fechaNacimiento" value={user.fechaNacimiento} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="genero">Género</label>
                <select name="genero" value={user.genero} onChange={handleChange}>
                  <option value="">Seleccione</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="fotoPerfil">Foto de Perfil</label>
                <input type="file" name="fotoPerfil" accept="image/*" onChange={(e) => setNuevaFoto(e.target.files[0])} />
              </div>
              <button type="submit" className="btn-perfil btn-primario">Actualizar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilUsuario;
