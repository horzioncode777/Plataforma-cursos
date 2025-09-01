import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Consetics.css";
import Navbar from "../components/Min";

const Consetics = () => {
  const [masConsejos, setMasConsejos] = useState([]);
  const [videoConsejos, setVideoConsejos] = useState([]);

  useEffect(() => {
    const fetchMasConsejos = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/masconsejos");
        setMasConsejos(data || []);
      } catch (err) {
        console.error("Error al cargar MAS CONSEJOS:", err);
      }
    };

    const fetchVideoConsejos = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/videoconsejos");
        setVideoConsejos(data || []);
      } catch (err) {
        console.error("Error al cargar VIDEO CONSEJOS:", err);
      }
    };

    fetchMasConsejos();
    fetchVideoConsejos();
  }, []);

  const getFullUrl = (path) =>
    path?.startsWith("http") ? path : `http://localhost:5000${path}`;

  const ciberAlertaData = [
    {
      titulo: "Evita que te hackeen",
      descripcion:
        "No uses la misma contraseña en diferentes servicios y cambia con frecuencia las más importantes. Usa un gestor de contraseñas, evita redes públicas sin VPN y mantén tu Wi-Fi, sistema operativo y antivirus siempre protegidos y actualizados.",
      imagen: "/assets/Cnadado.png",
    },
    {
      titulo: "Verifica URLs",
      descripcion:
        "Muchos ataques comienzan con enlaces falsos. Si recibes mensajes extraños con links, incluso de conocidos, no los abras sin verificar. Podrían robar tus datos o instalar virus. Revisa siempre la dirección y busca señales de seguridad, como el candado en el navegador.",
      imagen: "/assets/https.png",
    },
    {
      titulo: "Reporta el acoso digital",
      descripcion:
        "Si alguien te acosa, insulta o intenta manipularte, bloquéalo y repórtalo en la plataforma. Guarda capturas como evidencia y habla con alguien de confianza. No estás solo; denunciar es clave para protegerte y también puede evitar que otros sufran lo mismo.",
      imagen: "/assets/Incognito.png",
    },
    {
      titulo: "Verificación en dos pasos",
      descripcion:
        "Activa la verificación en dos pasos (2FA) en todas tus cuentas importantes. Así, si alguien obtiene tu contraseña, necesitará un segundo código que solo tú puedes recibir. Es una forma sencilla y muy efectiva de proteger tu información personal en línea.",
      imagen: "/assets/dospasos.png",
    },
  ];

  const tecnoTipsData = [
    {
      titulo: "Realiza copias de seguridad",
      descripcion: "No esperes a perder tus archivos importantes. Crea copias de seguridad en la nube o en un disco externo al menos una vez por semana. Así protegerás tus fotos, documentos y configuraciones frente a errores del sistema, robos o daños imprevistos.",
      imagen: "/assets/discoduro.png",
    },
    {
      titulo: "Aprende atajos de teclado",
      descripcion: "Usar atajos de teclado mejora tu productividad y te ayuda a navegar más rápido sin depender tanto del ratón. Aprende combinaciones básicas como copiar, pegar, cambiar ventanas o cerrar pestañas. Te harán trabajar de forma más ágil, cómoda y eficiente.",
      imagen: "/assets/teclado.png",
    },
    {
      titulo: "Alarga la vida de tu batería",
      descripcion: "Evita dejar tu dispositivo cargando toda la noche y no dejes que la batería llegue al 0 %. Usa el modo ahorro cuando sea necesario y reduce el brillo de la pantalla. Estos hábitos ayudan a mantener un buen rendimiento por más tiempo.",
      imagen: "/assets/pila.png",
    },
    {
      titulo: "Investiga antes de instalar programas",
      descripcion: "Antes de descargar software, busca reseñas y verifica que venga de la página oficial. Algunas apps traen malware escondido o instalan cosas sin tu permiso. Evita los “cracks” o instaladores pirata: son una puerta de entrada para virus y robos de información.",
      imagen: "/assets/instalar.png",
    },
  ];

  return (
    <>
      <div className="consetics-container">
        {/* Sección principal */}
        <header className="header-consetics">
          <div className="text-zone">
            <h1>CONSETIC</h1>
            <h2>CONSEJOS PARA LA VIDA DIGITAL</h2>
            <p>
              Aprende cómo proteger tu información y usar la tecnología con responsabilidad
            </p>
          </div>
          <div className="image-zone">
            <img src="/assets/Imagen-Consetic.png" alt="Ilustración persona segura" />
          </div>
        </header>

        {/* Sección de tarjetas: CiberAlerta */}
        <section className="card-section">
          <h2 className="section-title">CiberAlerta</h2>
          <div className="card-grid">
            {ciberAlertaData.map((item, index) => (
              <div className="info-card" key={`ciberalerta-${index}`}>
                <img src={item.imagen} alt={item.titulo} className="icono" />
                <h3>{item.titulo}</h3>
                <p>{item.descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Segunda sección de tarjetas: TecnoTips */}
        <section className="card-section">
          <h2 className="section-title">TecnoTips</h2>
          <div className="card-grid">
            {tecnoTipsData.map((item, index) => (
              <div className="info-card" key={`tecnotips-${index}`}>
                <img src={item.imagen} alt={item.titulo} className="icono" />
                <h3>{item.titulo}</h3>
                <p>{item.descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sección final: MÁS CONSEJOS y VIDEO CONSEJOS */}
        <section className="extra-section">
          <div className="extra-column">
            <h2 className="section-title">MAS CONSEJOS</h2>
            {masConsejos.length > 0 ? (
              masConsejos.map((item, index) => (
                <div className="extra-card" key={index}>
                  <img
                    src={getFullUrl(item.imagen)}
                    alt={item.titulo}
                    className="extra-image"
                  />
                  <div className="extra-text">
                    <h3>{item.titulo}</h3>
                    <p>{item.descripcion}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay consejos disponibles.</p>
            )}
          </div>

          <div className="extra-column">
            <h2 className="section-title">VIDEO CONSEJOS</h2>
            {videoConsejos.length > 0 ? (
              videoConsejos.map((video, index) => (
                <div key={index} className="video-card">
                  <video
                    width="100%"
                    height="240"
                    controls
                    poster={getFullUrl(video.thumbnail)}
                  >
                    <source
                      src={getFullUrl(video.videoUrl)}
                      type="video/mp4"
                    />
                    Tu navegador no soporta el video.
                  </video>
                </div>
              ))
            ) : (
              <p>No hay video consejos disponibles.</p>
            )}
          </div>
        </section>
      </div>

      {/* Navbar al final como en Noticias */}
      <section className="navMin consetics-ministerio">
        <Navbar />
      </section>
    </>
  );
};

export default Consetics;
