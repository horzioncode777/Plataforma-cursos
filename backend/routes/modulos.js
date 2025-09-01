const express = require("express");
const path = require("path");
const fs = require("fs");
const unzipper = require("unzipper");
const jwt = require("jsonwebtoken");
const MisCurso = require("../models/MisCurso");
const multer = require("multer");

const router = express.Router();

// === MULTER para subir ZIP con límite aumentado y verificación ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/zip-temp");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 600 * 1024 * 1024 }, // hasta 600MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/zip",
      "application/x-zip-compressed"
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos ZIP"));
    }
  },
});

// === Sanear nombres de carpetas ===
const sanitize = (str) =>
  str.normalize("NFD")
    .replace(/[^\w\-]+/g, "-")
    .replace(/\-+/g, "-");

// === Subir módulo ZIP corregido ===
router.post("/subir-modulo", upload.single("archivoZip"), async (req, res) => {
  try {
    const { modulo, curso } = req.body;

    if (!req.file) return res.status(400).json({ error: "No se envió el archivo ZIP" });
    if (!modulo || modulo.trim() === "")
      return res.status(400).json({ error: "Nombre del módulo no proporcionado" });

    const zipPath = req.file.path;

    if (!fs.existsSync(zipPath)) {
      return res.status(400).json({ error: "El archivo ZIP no existe en el servidor" });
    }

    const cursoNombre = sanitize(curso || "curso");
    const moduloNombre = sanitize(modulo);
    const folderName = `${Date.now()}-${cursoNombre}-${moduloNombre}`;
    const extractPath = path.join(__dirname, "../public/modulos", folderName);

    fs.mkdirSync(extractPath, { recursive: true });

    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .on("close", () => {
        const ruta = `/modulos/${folderName}/index.html`;
        console.log("✅ Módulo descomprimido en:", ruta);
        res.status(200).json({ nombre: modulo, ruta });
      })
      .on("error", (err) => {
        console.error("❌ Error al descomprimir ZIP:", err);
        res.status(500).json({ error: "Error al descomprimir ZIP", detalle: err.message });
      });

  } catch (error) {
    console.error("❌ Error general al subir módulo:", error);
    res.status(500).json({ mensaje: "Error al subir módulo", detalle: error.message });
  }
});

// === 🔐 Acceder a módulo (verifica token y pone cookie segura)
router.get("/acceder/:moduloId", async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(401).json({ message: "Token no proporcionado" });

    const secret = process.env.SECRET_KEY || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    const userId = decoded.id;
    const { moduloId } = req.params;

    const cursosInscritos = await MisCurso.find({ usuario: userId }).populate("curso");

    const tieneAcceso = cursosInscritos.some((inscrito) =>
      inscrito.curso?.linkModulos?.some((mod) => mod.ruta.includes(moduloId))
    );

    if (!tieneAcceso) {
      return res.status(403).json({ message: "No estás inscrito en este módulo" });
    }

    res.cookie("moduloToken", token, {
      httpOnly: true,
      maxAge: 5 * 60 * 1000,
    });

    res.redirect(`/modulos/${moduloId}/index.html`);
  } catch (error) {
    console.error("❌ Error al acceder al módulo:", error);
    res.status(500).json({ message: "Error interno al procesar acceso al módulo" });
  }
});

// === SERVIR archivos del módulo usando cookie
router.get("/:moduloId/*", async (req, res) => {
  try {
    const token = req.cookies.moduloToken;
    if (!token) {
      return res.status(401).sendFile(path.join(__dirname, "../public/error403.html"));
    }

    const secret = process.env.SECRET_KEY || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    const userId = decoded.id;
    const { moduloId } = req.params;
    const subPath = req.params[0];

    const cursosInscritos = await MisCurso.find({ usuario: userId }).populate("curso");

    const tieneAcceso = cursosInscritos.some((inscrito) =>
      inscrito.curso?.linkModulos?.some((mod) => mod.ruta.includes(moduloId))
    );

    if (!tieneAcceso) {
      return res.status(403).json({ message: "No estás inscrito en este módulo" });
    }

    const filePath = path.join(__dirname, `../public/modulos/${moduloId}/${subPath}`);
    if (!fs.existsSync(filePath)) {
      console.log("📁 Ruta no encontrada:", filePath);
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error("❌ Error al servir archivo del módulo:", error);
    res.status(500).json({ message: "❌ Error interno: no se pudo procesar el módulo" });
  }
});

// === 🔓 Cerrar acceso al módulo (elimina la cookie de sesión)
router.get("/cerrar-acceso", (req, res) => {
  res.clearCookie("moduloToken", {
    httpOnly: true,
    sameSite: "Lax",
  });
  res.status(200).json({ message: "Cookie de acceso al módulo eliminada" });
});

module.exports = router;