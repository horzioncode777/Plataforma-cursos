import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useDisableScroll from "../hooks/useDisableScroll";
import "./Register.css";
import Navbar from "../components/Min";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    tipoDocumento: "",
    numeroDocumento: "",
    fechaNacimiento: "",
    genero: "",
    discapacidad: "",
    municipio: "",
    telefono: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [mostrarPolitica, setMostrarPolitica] = useState(false);
  const navigate = useNavigate();

  useDisableScroll();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const autorizado = document.getElementById("autorizacionDatos");
    if (!autorizado.checked) {
      setError("Debes autorizar el tratamiento de datos personales.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/citizen/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrarse");
      }

      navigate("/loginUser");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container-main">
      <div className="info-box">
        <h2>¡Bienvenido!</h2>
        <p>
          Si ya tienes una cuenta, puedes iniciar sesión para acceder a los cursos
          que la Alcaldía de Cajicá tiene para ti.
        </p>
        <Link to="/loginUser" className="register-link">
          Iniciar Sesión
        </Link>
        <div className="logos">
          <img src="/assets/Logo Tic_Mesa de trabajo 1.png" alt="Logo 1" />
        </div>
      </div>

      <div className="register-form-container">
        <div className="register-form">
          <h2>CREA TU CUENTA</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
              <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <select name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange} required>
                <option value="">Tipo de documento</option>
                <option value="CC">Cédula de Ciudadanía (CC)</option>
                <option value="TI">Tarjeta de Identidad (TI)</option>
                <option value="CE">Cédula de Extranjería (CE)</option>
                <option value="PA">Pasaporte (PA)</option>
                <option value="RC">Registro Civil (RC)</option>
                <option value="PEP">Permiso Especial de Permanencia (PEP)</option>
              </select>

              <input
                type="text"
                name="numeroDocumento"
                placeholder="Número de Documento"
                value={formData.numeroDocumento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required />
              <select name="genero" value={formData.genero} onChange={handleChange} required>
                <option value="">Género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-row">
              <select name="discapacidad" value={formData.discapacidad} onChange={handleChange} required>
                <option value="">Discapacidad</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
              <input type="text" name="municipio" placeholder="Municipio" value={formData.municipio} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Correo" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row checkbox-row">
              <input type="checkbox" id="autorizacionDatos" required />
              <label htmlFor="autorizacionDatos">
                Autorizo el tratamiento de mis datos personales de acuerdo con la&nbsp;
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMostrarPolitica(true)}
                  className="link-politica"
                >
                  Política de Tratamiento de Datos
                </a>
                , para la gestión de mi inscripción.
              </label>
            </div>

            <button type="submit">Registrarme</button>
            <Link to="/loginUser" className="register-link-responsive">
              ¿Ya tienes cuenta? Inicia Sesión
            </Link>
          </form>

          {error && <p className="error-text">{error}</p>}
        </div>
      </div>

      {mostrarPolitica && (
        <div className="modal-overlay" onClick={() => setMostrarPolitica(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setMostrarPolitica(false)}>
              &times;
            </button>
            <h3>Política de Tratamiento de Datos</h3>
            <p>
              La Alcaldía Municipal de Cajicá se permite informar que el tratamiento de los datos personales
              recolectados se realiza de acuerdo a los requerimientos de la Ley 1581 de 2012 y el Decreto
              Nacional 1377 de 2013; los lineamientos relacionados con el manejo, administración y tratamiento
              de los datos personales se establecen en la Política de Tratamiento de Datos Personales adoptado
              mediante Decreto Municipal 141 del 13 de junio de 2019 y está disponible en la página web:&nbsp;
              <a
                href="https://www.cajica.gov.co"
                target="_blank"
                rel="noopener noreferrer"
                className="link-sitio"
              >
                www.cajica.gov.co
              </a>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterUser;
