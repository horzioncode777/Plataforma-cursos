// 📍 backend/controllers/inscripcionController.js
import MisCurso from "../models/MisCurso.js";

export const crearInscripcion = async (req, res) => {
  try {
    // Obtenemos el ID del usuario desde el token
    const usuario = req.user?._id || req.citizen?._id; 
    // ⚠️ soporte tanto para admin (req.user) como para ciudadano (req.citizen)

    // Verificamos que el curso haya sido proporcionado en el cuerpo de la solicitud
    const { curso } = req.body;
    if (!curso) {
      return res.status(400).json({ mensaje: "El curso es requerido" });
    }

    // Creamos la nueva inscripción
    const nuevaInscripcion = new MisCurso({
      usuario,
      curso,
    });

    // Guardamos la inscripción en la base de datos
    const inscripcionGuardada = await nuevaInscripcion.save();
    res.status(201).json(inscripcionGuardada);
  } catch (error) {
    console.error("❌ Error al crear inscripción:", error);
    res.status(400).json({ mensaje: "Error al crear inscripción", error });
  }
};

export const obtenerInscripciones = async (req, res) => {
  try {
    const inscripciones = await MisCurso.find()
      .populate("usuario", "nombre apellido") // Poblamos el campo de usuario con solo nombre y apellido
      .populate("curso", "title description") // ⚠️ Ajusté: en tu modelo es `title` y `description`
      .sort({ createdAt: -1 });

    res.status(200).json(inscripciones);
  } catch (error) {
    console.error("❌ Error al obtener inscripciones:", error);
    res.status(500).json({ mensaje: "Error al obtener inscripciones", error });
  }
};
