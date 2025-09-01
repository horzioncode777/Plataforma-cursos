import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CursoDetalle.css";

const CursoDetalle = () => {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
        setCurso(res.data);
      } catch (error) {
        console.error("Error al obtener curso:", error);
      }
    };
    fetchCurso();
  }, [id]);

  if (!curso) return <p>Cargando curso...</p>;

  return (
    <div className="curso-detalle">
      <div className="curso-header">
        {curso.image && (
          <img
            src={`http://localhost:5000${curso.image}`}
            alt={curso.title}
            className="curso-banner"
          />
        )}
        <div className="curso-info">
          <h1>{curso.title}</h1>
          <p>{curso.description}</p>
          {curso.linkContenido && (
            <a
              className="btn-enlace"
              href={curso.linkContenido}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver contenido externo 🔗
            </a>
          )}
        </div>
      </div>

      <h2 className="modulos-titulo">Módulos del Curso</h2>
      {curso.modulos?.length > 0 ? (
        curso.modulos.map((modulo, idx) => (
          <div key={idx} className="modulo">
            <h3>{modulo.nombre}</h3>
            <iframe
              src={`http://localhost:5000${modulo.ruta}`}
              width="100%"
              height="600px"
              frameBorder="0"
              title={modulo.nombre}
              className="modulo-iframe"
            ></iframe>
          </div>
        ))
      ) : (
        <p>Este curso aún no tiene módulos disponibles.</p>
      )}
    </div>
  );
};

export default CursoDetalle;
