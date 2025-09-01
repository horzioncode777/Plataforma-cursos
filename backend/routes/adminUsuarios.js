import express from "express";
import Citizen from "../models/Citizen.js";
import MisCurso from "../models/MisCurso.js";
import Course from "../models/Course.js";

const router = express.Router();

router.get("/usuarios", async (req, res) => {
  try {
    const ciudadanos = await Citizen.find();

    const resultados = await Promise.all(
      ciudadanos.map(async (usuario) => {
        const inscripciones = await MisCurso.find({ usuario: usuario._id }).populate("curso");
        const cursosInscritos = inscripciones.map((ins) => ins.curso);

        return {
          ...usuario.toObject(),
          cursosInscritos,
        };
      })
    );

    res.json(resultados);
  } catch (error) {
    console.error("❌ Error al obtener usuarios con cursos:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

export default router;
