import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useDisableScroll from "../hooks/useDisableScroll";
import "./Login.css";

const LoginUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useDisableScroll();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en el inicio de sesión");
      }

      localStorage.setItem("token", data.token);
      navigate("/Mi-Perfil"); // 👈 Redirecciona a la ruta de usuario
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-form">
          <h2>INICIA SESIÓN</h2>
          <form onSubmit={handleSubmit}>
            <div className="sesion">
              <input
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Cargando..." : "Entrar"}
            </button>
          </form>
          {error && <p className="error-text">{error}</p>}
          <p className="olvidaste">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
            <Link to="/registerUser" className="sesion-link-responsive">
            ¿No tienes cuenta? Registrate
          </Link>
          </p>
        </div>
      </div>

      <div className="register-container">
        <div className="register-box">
          <h2>¡Bienvenido, usuario!</h2>
          <p>
            "Tu aprendizaje comienza aquí: explora los cursos, crece cada día y deja tu huella."
          </p>
          <Link to="/registerUser" className="register-button">
            Registrarse
          </Link>
          <div className="logos">
            <img src="/assets/Logo Tic_Mesa de trabajo 1.png" alt="Logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;
