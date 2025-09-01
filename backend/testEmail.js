require("dotenv").config();
const nodemailer = require("nodemailer");

// 🔹 Configurar el transporte de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔹 Función para enviar correo de prueba
const enviarCorreo = async () => {
  try {
    await transporter.sendMail({
      from: `"Soporte" <${process.env.EMAIL_USER}>`,
      to: "juanes.2529.delgado@gmail.com", // 🔹 Cambia esto por tu correo para la prueba
      subject: "Prueba de correo ✔",
      text: "¡Hola! Este es un correo de prueba desde mi aplicación.",
    });

    console.log("Correo enviado correctamente ✅");
  } catch (error) {
    console.error("Error al enviar el correo ❌", error);
  }
};

// 🔹 Ejecutar la función de prueba
enviarCorreo();
