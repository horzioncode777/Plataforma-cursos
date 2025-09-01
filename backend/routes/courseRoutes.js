const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const MisCurso = require("../models/MisCurso");
const upload = require("../middleware/upload");
const authCitizen = require("../middleware/authCitizen"); // 🔐 Middleware corregido
const { crearCurso, actualizarCurso } = require("../controllers/courseController");

const multiUpload = upload.any();

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los cursos", error });
  }
});

router.post("/", multiUpload, crearCurso);
router.put("/:id", multiUpload, actualizarCurso);

router.delete("/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Curso eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el curso", error });
  }
});

// 🔐 Ruta protegida para módulos por link
router.get("/modulos/:cursoId", authCitizen, async (req, res) => {
  const userId = req.citizen._id;
  const { cursoId } = req.params;

  try {
    const inscripcion = await MisCurso.findOne({
      usuario: userId,
      curso: cursoId,
    });

    if (!inscripcion) {
      return res.status(403).json({ error: "No estás inscrito en este curso" });
    }

    const curso = await Course.findById(cursoId);
    if (!curso) return res.status(404).json({ error: "Curso no encontrado" });

    res.json(curso.linkModulos); // ✅ Devuelve los módulos por link
  } catch (error) {
    console.error("Error al obtener módulos:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
