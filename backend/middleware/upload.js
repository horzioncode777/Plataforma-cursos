import multer from "multer";
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const ruta = path.join(__dirname, "../uploads");
    fs.mkdirSync(ruta, { recursive: true });
    cb(null, ruta);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nombre = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, nombre);
  },
});

const upload = multer({ storage });

export default upload;
