import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import Navbar from "../components/Min";

const Home = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [visibleCoursesCount, setVisibleCoursesCount] = useState(3);

  useEffect(() => {
    axios.get("http://localhost:5000/api/courses")
      .then(response => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar los cursos:", error);
        setError("No se pudieron cargar los cursos. Inténtalo de nuevo más tarde.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const updateVisibleCourses = () => {
      if (window.matchMedia("(max-width: 426px)").matches) {
        setVisibleCoursesCount(1);
      } else if (window.matchMedia("(max-width: 768px)").matches) {
        setVisibleCoursesCount(2);
      } else {
        setVisibleCoursesCount(3);
      }
    };

    updateVisibleCourses();
    window.addEventListener("resize", updateVisibleCourses);
    return () => window.removeEventListener("resize", updateVisibleCourses);
  }, []);

  const nextSlide = () => {
    setVisibleIndex((prevIndex) => (prevIndex + 1) % courses.length);
  };

  const prevSlide = () => {
    setVisibleIndex((prevIndex) => (prevIndex - 1 + courses.length) % courses.length);
  };

  const getVisibleCourses = () => {
    if (courses.length < visibleCoursesCount) return courses;

    return Array.from({ length: visibleCoursesCount }, (_, i) => 
      courses[(visibleIndex + i) % courses.length]
    );
  };

  const handleInscribirse = () => {
    navigate("/loginUser");
  };

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Formación gratuita en Cajicá</h1>
          <h2>¡Inscríbete ahora!</h2>
          <div className="cursos-p">
            <p>Profundiza en tecnología y más</p>
            <p>Cursos para impulsar tu conocimiento</p>
          </div>
          <img src="/assets/Logo_Tic.jpg" alt="TIC.LOGO" className="sec-tic" />
        </div>
      </section>

      <section className="featured-courses">
        <h1>Cursos Destacados</h1>
        {loading ? (
          <p>Cargando cursos...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : courses.length === 0 ? (
          <p>No hay cursos disponibles.</p>
        ) : (
          <div className="carousel-container">
            <button className="arrow left" onClick={prevSlide}>❮</button>
            <div className="course-carousel">
              {getVisibleCourses().map((course) => (
                <div key={course._id} className="course-card">
                  <div className="barra">
                    <img
                      src={`http://localhost:5000${course.imagenPlataforma}`}
                      alt={course.title}
                      className="plataforma-image"
                    />
                    <button>Curso</button>
                  </div>
                  <img
                    src={`http://localhost:5000${course.image}`}
                    alt={course.title}
                    className="course-image"
                  />
                  <div className="barra-inferior">
                    <span>{course.title}</span>
                    <span className="descripcion" name="descrip">{course.description}</span>
                    <button onClick={handleInscribirse}>Inscribirse</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="arrow right" onClick={nextSlide}>❯</button>
          </div>
        )}

        <section className="ministerio home-ministerio">
          <Navbar />
        </section>
      </section>
    </div>
  );
};

export default Home;
