const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../uploads/");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "application/zip",
  "application/x-zip-compressed",
];

const upload = multer({
  storage,
  limits: { fileSize: 600 * 1024 * 1024 }, // 🔧 Ahora permite hasta 600MB
  fileFilter: function (req, file, cb) {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Archivo no permitido: " + file.mimetype));
    }
  },
});


// Ruta para subida de imagen individual
router.post("/", upload.single("imagen"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se recibió archivo" });

  // ✅ Devolver solo la ruta relativa
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

module.exports = router;
