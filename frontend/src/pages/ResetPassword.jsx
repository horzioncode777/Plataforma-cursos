import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams(); // Obtener el token desde la URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Bloquear el scroll al montar el componente y restaurarlo al desmontar
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Bloquea el scroll

    return () => {
      document.body.style.overflow = "auto"; // Restaura el scroll al desmontar
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        setTimeout(() => navigate("/loginUser"), 2000);
      }
    } catch (err) {
      setMessage("Error al restablecer la contraseña.");
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2>Restablecer Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Restablecer</button>
          <img src="/assets/LogoTicAzul.png" alt="Logo 1" />
        </form>
        {message && <p className={message.includes("Error") || message.includes("no coinciden") ? "message error" : "message"}>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
