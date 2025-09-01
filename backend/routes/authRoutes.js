import express from "express";
import User from "../models/User.js";
import Citizen from "../models/Citizen.js"; // ✅ Modelo para ciudadanos
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

// 🔹 Configurar Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔹 Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Acceso denegado, token requerido" });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token no válido o expirado" });
  }
};

// 🔹 Registro de usuario (admin)
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    console.error("Error en /register:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// 🔹 Inicio de sesión (admin)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ token, message: "Inicio de sesión exitoso" });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// 🔹 Inicio de sesión (ciudadano)
router.post("/login-user", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const user = await Citizen.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ token, message: "Inicio de sesión exitoso" });
  } catch (error) {
    console.error("Error en login-user:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// 🔹 Olvidé mi contraseña
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Primero buscar en User (admin)
    let user = await User.findOne({ email });
    let modelType = "User";

    // Si no lo encuentra en User, buscar en Citizen (ciudadano)
    if (!user) {
      user = await Citizen.findOne({ email });
      modelType = "Citizen";
    }

    if (!user) {
      return res.status(400).json({ message: "Correo no registrado" });
    }

    const token = jwt.sign({ id: user._id, type: modelType }, SECRET_KEY, { expiresIn: "1h" });
    const resetLink = `http://localhost:5174/reset-password/${token}`;

    const mailOptions = {
      from: `"Soporte" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Recuperación de Contraseña",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333;">🔒 Recuperación de Contraseña</h2>
            <p style="color: #555;">Hola, has solicitado restablecer tu contraseña.</p>
            <p style="color: #555;">Haz clic en el botón de abajo para continuar:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; margin: 10px 0; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
              Restablecer Contraseña
            </a>
            <p style="color: #777; font-size: 12px;">Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
            <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
            <img src="https://i.imgur.com/FsmZIE9.png" alt="Logo de TIC" style="width: 300px;">
          </div>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error al enviar el correo:", error);
        return res.status(500).json({ message: "Error al enviar el correo" });
      }
      res.json({ message: "Correo enviado con éxito" });
    });
  } catch (error) {
    console.error("Error en /forgot-password:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// 🔹 Restablecer la contraseña
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded) return res.status(400).json({ message: "Token inválido o expirado" });

    const hashedPassword = await bcrypt.hash(password, 12);

    if (decoded.type === "User") {
      await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    } else if (decoded.type === "Citizen") {
      await Citizen.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    } else {
      return res.status(400).json({ message: "Tipo de usuario inválido" });
    }

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error en /reset-password:", error);
    res.status(403).json({ message: "Token inválido o expirado" });
  }
});

// 🔹 Cerrar sesión
router.post("/logout", (req, res) => {
  res.json({ message: "Sesión cerrada con éxito" });
});

export default router;
