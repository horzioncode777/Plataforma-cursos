import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CursoModulo = () => {
  const { id } = useParams();
  const [rutaModulo, setRutaModulo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerCurso = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses`);
        const data = await response.json();

        // Busca el curso por id
        const curso = data.find((c) => c._id === id);
        if (!curso) {
          setError("Curso no encontrado");
          return;
        }

        // Asume que el módulo está en la primera posición
        if (curso.modulos && curso.modulos.length > 0) {
          setRutaModulo(curso.modulos[0].ruta);
        } else {
          setError("Este curso no tiene módulos.");
        }
      } catch (err) {
        setError("Error al cargar el módulo.");
      } finally {
        setLoading(false);
      }
    };

    obtenerCurso();
  }, [id]);

  if (loading) return <p>Cargando módulo...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ width: "100%", height: "90vh", border: "1px solid #ccc" }}>
      <iframe
        src={rutaModulo}
        title="Módulo del curso"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
};

export default CursoModulo;
