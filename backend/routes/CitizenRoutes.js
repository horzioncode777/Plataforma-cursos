import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path, { dirname } from "path";
import multer from "multer";
import { fileURLToPath } from "url";

import Citizen from "../models/Citizen.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authCitizen from "../middleware/authCitizen.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configuración de Multer para imágenes de perfil
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/perfiles/"); // Carpeta para almacenar imágenes de perfil
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isValidMime = allowedTypes.test(file.mimetype);
  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes .jpg, .jpeg, .png"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB máximo
  fileFilter,
});

// Registrar ciudadano
router.post("/register-user", async (req, res) => {
  const {
    nombre,
    apellido,
    tipoDocumento,
    numeroDocumento,
    fechaNacimiento,
    genero,
    discapacidad,
    municipio,
    telefono,
    email,
    password,
  } = req.body;

  try {
    const existingCitizen = await Citizen.findOne({
      $or: [{ email }, { numeroDocumento }],
    });

    if (existingCitizen) {
      return res.status(400).json({ message: "Ya existe un ciudadano con ese correo o documento." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCitizen = new Citizen({
      nombre,
      apellido,
      tipoDocumento,
      numeroDocumento,
      fechaNacimiento,
      genero,
      discapacidad,
      municipio,
      telefono,
      email,
      password: hashedPassword,
    });

    await newCitizen.save();

    const token = jwt.sign({ id: newCitizen._id }, process.env.SECRET_KEY, { expiresIn: "7d" });

    res.status(201).json({ token });
  } catch (error) {
    console.error("Error al registrar ciudadano:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// Obtener perfil
router.get("/perfil", authCitizen, (req, res) => {
  res.status(200).json(req.citizen);
});

// Obtener todos los ciudadanos
router.get("/users", async (req, res) => {
  try {
    const citizens = await Citizen.find().select("-password");
    res.status(200).json(citizens);
  } catch (error) {
    console.error("Error al obtener ciudadanos:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// Actualizar perfil completo (datos + imagen)
router.put("/perfil", authCitizen, upload.single("fotoPerfil"), async (req, res) => {
  try {
    const citizen = await Citizen.findById(req.citizen._id);

    if (!citizen) {
      return res.status(404).json({ message: "Ciudadano no encontrado" });
    }

    const { nombre, apellido, telefono, email, municipio, discapacidad, genero, fechaNacimiento } = req.body;

    if (nombre) citizen.nombre = nombre;
    if (apellido) citizen.apellido = apellido;
    if (telefono) citizen.telefono = telefono;
    if (email) citizen.email = email;
    if (municipio) citizen.municipio = municipio;
    if (discapacidad) citizen.discapacidad = discapacidad;
    if (genero) citizen.genero = genero;
    if (fechaNacimiento) citizen.fechaNacimiento = fechaNacimiento;

    if (req.file) {
      if (citizen.fotoPerfil) {
        const oldPath = path.join(__dirname, "..", citizen.fotoPerfil);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      citizen.fotoPerfil = req.file.path;
    }

    await citizen.save();

    res.status(200).json({
      message: "Perfil actualizado correctamente",
      citizen: {
        nombre: citizen.nombre,
        apellido: citizen.apellido,
        telefono: citizen.telefono,
        email: citizen.email,
        fotoPerfil: citizen.fotoPerfil,
      },
    });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ message: "Error del servidor al actualizar el perfil", error });
  }
});

// Actualizar solo imagen de perfil
router.put("/perfil/foto", authCitizen, upload.single("fotoPerfil"), async (req, res) => {
  try {
    const citizen = await Citizen.findById(req.citizen._id);

    if (!citizen) {
      return res.status(404).json({ message: "Ciudadano no encontrado" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No se proporcionó una imagen de perfil." });
    }

    if (citizen.fotoPerfil) {
      const oldPath = path.join(__dirname, "..", citizen.fotoPerfil);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    citizen.fotoPerfil = req.file.path;
    await citizen.save();

    res.status(200).json({
      message: "Imagen de perfil actualizada correctamente",
      imagenPerfil: citizen.fotoPerfil.split("uploads/perfiles/")[1],
    });
  } catch (error) {
    console.error("Error al actualizar imagen de perfil:", error);
    res.status(500).json({ message: "Error al actualizar la imagen de perfil", error });
  }
});

export default router;
