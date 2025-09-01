const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
module.exports = upload;
