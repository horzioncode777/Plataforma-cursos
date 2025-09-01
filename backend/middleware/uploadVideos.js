const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Asegurar que exista la carpeta 'uploads'
const uploadDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const allowedMimeTypes = [
  "video/mp4",
  "video/quicktime",
  "image/jpeg",
  "image/png",
  "image/gif",
];

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: function (req, file, cb) {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Archivo no permitido: " + file.mimetype));
    }
  },
});

module.exports = upload;
