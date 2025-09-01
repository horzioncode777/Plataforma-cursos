import express from "express";
import {
  obtenerCursosInscritos,
  inscribirseCurso,
  eliminarInscripcion, // 👈 también lo importamos
} from "../controllers/misCursosController.js";
import authCitizen from "../middleware/authCitizen.js";

const router = express.Router();

// 🔹 Obtener cursos inscritos
router.get("/", authCitizen, obtenerCursosInscritos);

// 🔹 Inscribirse en un curso
router.post("/inscribirse", authCitizen, inscribirseCurso);

// 🔹 Eliminar inscripción (NUEVA RUTA 🔥)
router.delete("/:id", authCitizen, eliminarInscripcion);

export default router;
