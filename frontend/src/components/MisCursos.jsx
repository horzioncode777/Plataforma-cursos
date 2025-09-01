const MisCursos = () => {
    const [cursos, setCursos] = useState([]);
  
    useEffect(() => {
      // Aquí conectas con backend
      const fetchCursos = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/user/cursos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCursos(data);
      };
  
      fetchCursos();
    }, []);
  
    return (
      <div className="contenido-cursos">
        <div className="filtros">
          <input type="text" placeholder="¿Qué quieres aprender?" />
          <select><option>Tipo</option></select>
        </div>
        <div className="tarjetas-cursos">
          {cursos.map((curso) => (
            <div className="curso-card" key={curso._id}>
              <img src={curso.imagen} alt={curso.nombre} />
              <h3>{curso.nombre}</h3>
              <button>
                {curso.estado === "finalizado" ? "Finalizado" : "Continuar"}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };
  