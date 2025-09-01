import express from "express";
import upload from "../middleware/uploadVideos.js";

import {
  getAllVideoConsejos,
  createVideoConsejo,
  updateVideoConsejo,
  deleteVideoConsejo,
} from "../controllers/videoConsejoController.js";

const router = express.Router();

// Middleware con verificación explícita de campos
const videoUpload = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

// 🔹 Obtener todos los videoConsejos
router.get("/", getAllVideoConsejos);

// 🔹 Crear un nuevo videoConsejo
router.post(
  "/",
  videoUpload,
  (req, res, next) => {
    console.log("✅ Archivos recibidos en POST:", Object.keys(req.files || {}));
    next();
  },
  createVideoConsejo
);

// 🔹 Actualizar un videoConsejo existente
router.put(
  "/:id",
  videoUpload,
  (req, res, next) => {
    console.log("✅ Archivos recibidos en PUT:", Object.keys(req.files || {}));
    next();
  },
  updateVideoConsejo
);

// 🔹 Eliminar un videoConsejo
router.delete("/:id", deleteVideoConsejo);

export default router;
