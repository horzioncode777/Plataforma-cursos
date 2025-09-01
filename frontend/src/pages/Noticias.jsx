import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Noticias.css";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Min";

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/noticias")
      .then((response) => {
        console.log("Noticias recibidas:", response.data);
        setNoticias(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar las noticias:", error);
        setError("No se pudieron cargar las noticias. Inténtalo de nuevo más tarde.");
        setLoading(false);
      });
  }, []);

  const noticiaPrincipal = noticias.find((noticia) => noticia.isMain) || noticias[0] || {};
  const noticiasSecundarias = noticias.filter((noticia) => noticia !== noticiaPrincipal);

  const formatFecha = (fecha) => (fecha ? fecha.split("T")[0] : "Fecha no disponible");

  return (
    <>
      
      <section className="noticias-container">
        <h2 className="titulo">NOTICIAS</h2>

        {loading ? (
          <p className="loading-message">Cargando noticias...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : noticias.length === 0 ? (
          <p className="no-noticias">No hay noticias disponibles.</p>
        ) : (
          <>
            <div className="noticia-principal">
              <img
                src={
                  noticiaPrincipal.image
                    ? `http://localhost:5000${noticiaPrincipal.image}`
                    : "https://via.placeholder.com/300"
                }
                alt={noticiaPrincipal.title || "Noticia Principal"}
                className="noticia-imagen"
              />
              <div className="noticia-info">
                <p className={`fecha ${noticiaPrincipal.isMain ? "fecha-principal" : ""}`}>
                  {formatFecha(noticiaPrincipal.date)}
                </p>
                <h3 className="titulo-noticia">{noticiaPrincipal.title || "Sin título"}</h3>
                <p className={`description ${noticiaPrincipal.isMain ? "description-principal" : ""}`}>
                  {noticiaPrincipal.description || "Sin descripción"}
                </p>
                {noticiaPrincipal.link && (
                  <button className="ver-mas" onClick={() => window.open(noticiaPrincipal.link, "_blank")}>
                    Ver más
                  </button>
                )}
              </div>
            </div>
            <div className="noticias-grid">
              {noticiasSecundarias.map((noticia) => (
                <div key={noticia._id} className="noticia-card">
                  <img
                    src={
                      noticia.image ? `http://localhost:5000${noticia.image}` : "https://via.placeholder.com/300"
                    }
                    alt={noticia.title || "Noticia"}
                    className="noticia-imagen"
                  />
                  <p className="fecha">{formatFecha(noticia.date)}</p>
                  <h3 className="titulo-noticia">{noticia.title || "Sin título"}</h3>
                  <p className="description">{noticia.description}</p>
                  {noticia.link && (
                    <button className="ver-mas" onClick={() => window.open(noticia.link, "_blank")}>
                      Ver más
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </section>
      <section className="navMin noticias-ministerio">
        <Navbar />
      </section>

    </>
  );
};

export default Noticias;
