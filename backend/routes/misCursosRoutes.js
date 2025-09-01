const express = require("express");
const router = express.Router();
const {
  obtenerCursosInscritos,
  inscribirseCurso,
  eliminarInscripcion, // 👈 Importamos también eliminar
} = require("../controllers/misCursosController");
const authCitizen = require("../middleware/authCitizen");

// 🔹 Obtener cursos inscritos
router.get("/", authCitizen, obtenerCursosInscritos);

// 🔹 Inscribirse en un curso
router.post("/inscribirse", authCitizen, inscribirseCurso);

// 🔹 Eliminar inscripción (NUEVA RUTA 🔥)
router.delete("/:id", authCitizen, eliminarInscripcion);

module.exports = router;
