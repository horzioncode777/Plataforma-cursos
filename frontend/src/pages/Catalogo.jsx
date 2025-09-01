import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Catalogo.css";

const Catalogo = ({ busqueda }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/courses")
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar los cursos:", error);
        setError("No se pudieron cargar los cursos. Inténtalo de nuevo más tarde.");
        setLoading(false);
      });
  }, []);

  const handleEnroll = async (course) => {
    try {
      await axios.post(
        "http://localhost:5000/api/miscursos/inscribirse",
        { cursoId: course._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage(`✅ Inscrito exitosamente en: ${course.title}`);
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al inscribirse:", error);
      setErrorMessage(error.response?.data?.mensaje || "Error al inscribirse.");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // 🔵 Filtrar cursos por término de búsqueda
  const cursosFiltrados = courses.filter((course) =>
    course.title.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="catalogo-container">
      <h1>Cursos disponibles</h1>

      {successMessage && <p className="catalogo-success">{successMessage}</p>}
      {errorMessage && <p className="catalogo-error">{errorMessage}</p>}

      {loading ? (
        <p>Cargando cursos...</p>
      ) : error ? (
        <p className="catalogo-error">{error}</p>
      ) : cursosFiltrados.length === 0 ? (
        <p>No se encontraron cursos.</p>
      ) : (
        <div className="course-list">
          {cursosFiltrados.map((course) => (
            <div key={course._id} className="course-card">
              <div className="barra">
                <img
                  src={`http://localhost:5000${course.imagenPlataforma}`}
                  alt={course.title}
                  className="plataforma-image"
                />
                <button className="etiqueta">Curso</button>
              </div>
              <img
                src={`http://localhost:5000${course.image}`}
                alt={course.title}
                className="course-image"
              />
              <div className="barra-inferior">
                <span className="titulo-curso">{course.title}</span>
                <span className="descripcion">{course.description}</span>
                <button
                  className="btn-inscribirse"
                  onClick={() => handleEnroll(course)}
                >
                  Inscribirse
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalogo;
