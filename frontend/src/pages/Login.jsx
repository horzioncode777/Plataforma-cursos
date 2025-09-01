import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useDisableScroll from "../hooks/useDisableScroll";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useDisableScroll(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en el inicio de sesión");
      }

      localStorage.setItem("token", data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
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
            <button type="submit">Entrar</button>
          </form>
          {error && <p className="error-text">{error}</p>}
          <p className="olvidaste">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </p>
        </div>
      </div>
      <div className="register-container">
        <div className="register-box">
          <h2>RECUERDA QUE ERES ADMINISTRADOR</h2>
          <p>
            "Tu trabajo da forma a cada detalle de la página. Pequeños cambios,
            grandes impactos. ¡Sigue haciendo la diferencia!" 🚀✨
          </p>
          <div className="logos">
            <img src="/assets/Logo Tic_Mesa de trabajo 1.png" alt="Logo 1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
