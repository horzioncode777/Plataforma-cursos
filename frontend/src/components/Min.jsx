// src/components/Ministerio.js
import React from "react";
import Alcaldia from "/assets/Alcaldia-tic.png";
import "./Min.css"; // Crea un archivo CSS si deseas estilos específicos

const Ministerio = () => {
  return (
    <section className="ministerio">
      <div className="ministerio-container">
        <h2>ALCALDÍA MUNICIPAL DE CAJICÁ</h2>
        <p>Dirección Sede Principal: Calle 2 # 4-07</p>
        <p>PBX: <a href="tel:8837077">8837077</a> - Móvil PQRs: <a href="tel:+573152378409">+57 3152378409</a></p>
        <p>Línea Anticorrupción: <a href="tel:018000912667">PBX 8837077</a> <a href="tel:14001">ext 14001</a></p>
        <p>Correo electrónico: <a href="mailto:ventanillapqrs-alcaldia@cajica.gov.co">ventanillapqrs-alcaldia@cajica.gov.co</a></p>
        <p>Notificaciones judiciales: 
          <a href="mailto:sjurnotificaciones@cajica.gov.co">sjurnotificaciones@cajica.gov.co</a>
        </p>
        <p>Horario de Atención:</p>
        <p>Lunes a Jueves de 8:00 a.m a 1:00 p.m - 2:00 p.m a 5:30 p.m</p>
        <p>Viernes de 8:00 a.m a 1:00 p.m - 2:00 p.m a 4:30 p.m</p>
        <p>Horario de Atención Ventanilla Hacienda:</p>
        <p>Lunes a Viernes de 8:00 a.m a 4:00 p.m - Jornada Continua</p>
        <p>Derechos Reservados ©Alcaldía de Cajicá - Política de Privacidad</p>
      </div>
      <div className="footer">
        <img src={Alcaldia} alt="Alcaldia-tic" />
      </div>
    </section>
  );
};

export default Ministerio;
