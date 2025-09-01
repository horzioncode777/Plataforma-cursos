import express from "express";
import multer from "multer";
import unzipper from "unzipper";
import fs from "fs-extra";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Course from "../models/Course.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// GET /api/modulos/prueba
router.get("/prueba", (req, res) => {
  res.json({ mensaje: "✅ Ruta /api/modulos/prueba activa" });
});

// Configurar almacenamiento de ZIP temporal
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tmpDir = path.join(__dirname, "../tmp");
    fs.ensureDirSync(tmpDir);
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST /api/modulos/subir-modulo
router.post("/subir-modulo", upload.single("archivoZip"), async (req, res) => {
  try {
    const archivoZip = req.file;
    const { curso, modulo } = req.body;

    if (!archivoZip || !curso || !modulo) {
      return res.status(400).json({ mensaje: "Faltan datos requeridos" });
    }

    const destino = path.join(__dirname, `../public/cursos/${curso}/${modulo}`);
    await fs.ensureDir(destino);
    await fs.createReadStream(archivoZip.path).pipe(unzipper.Extract({ path: destino })).promise();

    // Buscar index.html en cualquier subcarpeta
    const encontrarIndex = async (base) => {
      const files = await fs.readdir(base);
      for (const file of files) {
        const fullPath = path.join(base, file);
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
          const result = await encontrarIndex(fullPath);
          if (result) return result;
        } else if (file.toLowerCase() === "index.html") {
          return fullPath;
        }
      }
      return null;
    };

    const indexPath = await encontrarIndex(destino);
    if (!indexPath) {
      return res.status(400).json({ mensaje: "No se encontró index.html dentro del ZIP" });
    }

    const rutaRelativa = indexPath.split("public")[1].replace(/\\/g, "/");
    await fs.remove(archivoZip.path);

    // ✨ Actualizar curso en base de datos
    const cursoExistente = await Course.findOne({ title: curso });
    if (!cursoExistente) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    cursoExistente.modulos.push({
      nombre: modulo,
      archivos: [{ nombre: "index.html", url: rutaRelativa }],
    });
    await cursoExistente.save();

    return res.status(201).json({
      mensaje: "Módulo subido y descomprimido correctamente",
      ruta: rutaRelativa,
    });
  } catch (error) {
    console.error("❌ Error al subir módulo:", error);
    return res.status(500).json({ mensaje: "Error al subir módulo" });
  }
});

export default router;
