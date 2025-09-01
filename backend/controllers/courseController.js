const Course = require("../models/Course");

const crearCurso = async (req, res) => {
  try {
    const { title, description, linkContenido, linkModulos } = req.body;

    const cleanTitle = title.trim();
    let modulosLink = [];

    if (linkModulos) {
      try {
        modulosLink = JSON.parse(linkModulos);
      } catch (e) {
        return res.status(400).json({ error: "Error al procesar linkModulos" });
      }
    }

    let imagePath = null;
    let imagenPlataformaPath = null;

    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        if (file.fieldname === "image") {
          imagePath = `/uploads/${file.filename}`;
        } else if (file.fieldname === "imagenPlataforma") {
          imagenPlataformaPath = `/uploads/${file.filename}`;
        }
      });
    }

    const nuevoCurso = new Course({
      title: cleanTitle,
      description,
      linkContenido,
      image: imagePath,
      imagenPlataforma: imagenPlataformaPath,
      linkModulos: modulosLink,
    });

    const saved = await nuevoCurso.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Error al crear el curso:", error);
    res.status(500).json({ mensaje: "Error al crear el curso" });
  }
};

const actualizarCurso = async (req, res) => {
  try {
    const { title, description, linkContenido, linkModulos } = req.body;

    let parsedLinkModulos = [];
    if (linkModulos) {
      try {
        parsedLinkModulos = JSON.parse(linkModulos);
      } catch (e) {
        return res.status(400).json({ error: "Error al procesar linkModulos" });
      }
    }

    let imagePath = null;
    let imagenPlataformaPath = null;

    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        if (file.fieldname === "image") {
          imagePath = `/uploads/${file.filename}`;
        } else if (file.fieldname === "imagenPlataforma") {
          imagenPlataformaPath = `/uploads/${file.filename}`;
        }
      });
    }

    const updatedFields = {
      title,
      description,
      linkContenido,
      linkModulos: parsedLinkModulos,
    };

    if (imagePath) updatedFields.image = imagePath;
    if (imagenPlataformaPath) updatedFields.imagenPlataforma = imagenPlataformaPath;

    const cursoActualizado = await Course.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
    });

    res.json(cursoActualizado);
  } catch (error) {
    console.error("❌ Error al actualizar el curso:", error);
    res.status(500).json({ mensaje: "Error al actualizar el curso" });
  }
};

module.exports = {
  crearCurso,
  actualizarCurso,
};