import { useEffect, useState } from "react";
import axios from "axios";
import "./MisCursos.css";

const MisCursos = ({ busqueda }) => {
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [modulos, setModulos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [mostrarPanel, setMostrarPanel] = useState(false);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/miscursos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("No se pudieron cargar los cursos");

        const data = await res.json();
        setCursos(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCursos();
  }, []);

  const handleVerModulos = (curso) => {
    if (curso.linkModulos && Array.isArray(curso.linkModulos)) {
      setModulos(curso.linkModulos);
      setCursoSeleccionado(curso.title);
      setMostrarPanel(true);
    } else {
      setError("Este curso no tiene módulos disponibles.");
    }
  };

  const handleEliminarCurso = async (idInscripcion) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este curso?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/miscursos/${idInscripcion}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCursos(cursos.filter((curso) => curso._id !== idInscripcion));
      setError("");
      setMensaje("✅ Curso eliminado exitosamente.");

      setTimeout(() => setMensaje(""), 3000);
    } catch (err) {
      console.error("Error al eliminar el curso", err);
      setError("Error al eliminar el curso.");
      setMensaje("");
    }
  };

  const cerrarPanel = () => {
    setMostrarPanel(false);
    setModulos([]);
    setCursoSeleccionado(null);
  };

  const cursosFiltrados = cursos.filter((item) => {
    if (!item.curso) return false;
    return item.curso.title.toLowerCase().includes(busqueda.toLowerCase());
  });

  const token = localStorage.getItem("token");

  return (
    <div className="mc-fondo">
      <div className="mc-contenedor">
        <h2 className="mc-titulo">Mis cursos</h2>

        {error && <p className="mc-error">{error}</p>}
        {mensaje && <p className="mc-exito">{mensaje}</p>}

        {cursosFiltrados.length === 0 ? (
          <p className="mc-vacio">No se encontraron cursos.</p>
        ) : (
          <div className="mc-listado">
            {cursosFiltrados.map((item) => (
              <div key={item._id} className="mc-curso-card">
                {item.curso ? (
                  <>
                    <img
                      src={
                        item.curso.image
                          ? `http://localhost:5000${item.curso.image}`
                          : "/assets/default-course.jpg"
                      }
                      alt={item.curso.title}
                      className="mc-curso-img"
                    />
                    <div className="mc-curso-contenido">
                      <p className="mc-fecha-inscripcion">
                        Inscrito el: {new Date(item.fechaInscripcion).toLocaleDateString()}
                      </p>
                      <h3 className="mc-curso-titulo">{item.curso.title}</h3>
                      <p className="mc-curso-descripcion">{item.curso.description}</p>

                      <div className="mc-botones">
                        <button
                          className="mc-btn mc-btn-reanudar"
                          onClick={() => handleVerModulos(item.curso)}
                        >
                          Reanudar
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mc-curso-contenido">
                    <h3 className="mc-curso-titulo">Curso no disponible</h3>
                    <p className="mc-curso-descripcion">
                      Este curso ha sido eliminado por el administrador.
                    </p>
                    <div className="mc-botones">
                      <button
                        className="mc-btn mc-btn-eliminar"
                        onClick={() => handleEliminarCurso(item._id)}
                      >
                        Eliminar de mi lista
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

{mostrarPanel && (
  <div className="mc-panel-modulos">
    <div className="mc-panel-contenido">
      <span className="mc-cerrar-x" onClick={cerrarPanel}>×</span>
      <h3>Módulos del curso: {cursoSeleccionado}</h3>
      {modulos.length === 0 ? (
        <p>No hay módulos disponibles.</p>
      ) : (
        modulos.map((mod, i) => {
          const moduloId = mod.ruta.split("/")[2];
          const rutaSegura = `http://localhost:5000/modulos/acceder/${moduloId}?token=${token}`;
          return (
            <button
              key={i}
              className="mc-btn mc-btn-modulo"
              onClick={() => window.open(rutaSegura, "_blank")}
            >
              {mod.nombre || `Módulo ${i + 1}`}
            </button>
          );
        })
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default MisCursos;
