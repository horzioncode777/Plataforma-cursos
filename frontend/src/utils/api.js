// utils/api.js
export const inscribirseACurso = async (cursoId) => {
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch("http://localhost:5000/api/miscursos/inscribirse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ cursoId }), // el usuario se extrae desde el token
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.message || "Error al inscribirse");
  
      return data;
    } catch (error) {
      throw error;
    }
  };
  