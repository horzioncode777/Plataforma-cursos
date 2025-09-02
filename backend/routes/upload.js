import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer para manejar archivos en memoria (no en disco)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para subir a Cloudinary
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se recibió archivo" });
    }

    // Subida a Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "cursos" }, // 👈 Carpeta dentro de Cloudinary
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // ✅ Devolver la URL segura
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("❌ Error al subir imagen:", err);
    res.status(500).json({ error: "Error al subir imagen" });
  }
});

export default router;
