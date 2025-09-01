import { useState, useEffect } from "react";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

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

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Error al enviar el correo. Inténtalo nuevamente.");
    }
  };

  return (
    <section className="naa">
      <div className="forgot-password-container">
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <h2>Recuperar Contraseña</h2>
          <input
            type="email"
            placeholder="Ingrese su correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Enviar enlace de recuperación</button>
          {message && <p className="forgot-password-message">{message}</p>}
          <p className="mensaje">
            "Las contraseñas se olvidan, pero tu capacidad de resolver problemas nunca.
            Recupera la tuya y sigue adelante como el pro que eres."
          </p>
          <p className="emojis">🔥💻🔑</p>
          <img src="/assets/LogoTicAzul.png" alt="Logo 1" />
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
