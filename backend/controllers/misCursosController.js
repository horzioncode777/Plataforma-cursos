const MisCurso = require("../models/MisCurso");

// 🔹 Obtener cursos inscritos
const obtenerCursosInscritos = async (req, res) => {
  const usuarioId = req.citizen._id;

  try {
    const cursos = await MisCurso.find({ usuario: usuarioId })
      .populate({
        path: "curso",
        select: "title description image linkContenido linkModulos", // ✅ Agregado
      });

    res.status(200).json(cursos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener cursos", error: error.message });
  }
};

// 🔹 Inscribirse a un curso
const inscribirseCurso = async (req, res) => {
  const usuarioId = req.citizen._id;
  const { cursoId } = req.body;

  try {
    const yaExiste = await MisCurso.findOne({ usuario: usuarioId, curso: cursoId });
    if (yaExiste) {
      return res.status(400).json({ mensaje: "Ya estás inscrito en este curso" });
    }

    const nuevaInscripcion = new MisCurso({ usuario: usuarioId, curso: cursoId });
    await nuevaInscripcion.save();

    res.status(201).json({ mensaje: "Inscripción exitosa", inscripcion: nuevaInscripcion });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al inscribirse", error: error.message });
  }
};

// 🔹 Eliminar inscripción
const eliminarInscripcion = async (req, res) => {
  const usuarioId = req.citizen._id;
  const inscripcionId = req.params.id;

  try {
    const inscripcion = await MisCurso.findOne({ _id: inscripcionId, usuario: usuarioId });

    if (!inscripcion) {
      return res.status(404).json({ mensaje: "Inscripción no encontrada" });
    }

    await MisCurso.deleteOne({ _id: inscripcionId });

    res.status(200).json({ mensaje: "Inscripción eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la inscripción", error: error.message });
  }
};

module.exports = {
  obtenerCursosInscritos,
  inscribirseCurso,
  eliminarInscripcion,
};
