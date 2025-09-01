const express = require("express");
const router = express.Router();
const Noticias = require("../models/Noticias");
const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento para las imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada imagen
  },
});

const upload = multer({ storage: storage });

// Obtener todas las noticias
router.get("/", async (req, res) => {
  try {
    const noticias = await Noticias.find();
    res.json(noticias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear una nueva noticia con imagen, link y isMain
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const nuevaNoticia = new Noticias({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date || new Date(), // Usa la fecha actual si no se proporciona
      content: req.body.content,
      link: req.body.link || "", // Nuevo campo link, opcional
      isMain: req.body.isMain === "true" || false, // Nuevo campo isMain, marca como principal
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await nuevaNoticia.save();
    res.status(201).json(nuevaNoticia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Editar una noticia con nueva imagen, link y isMain
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const datosActualizados = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date || new Date(),
      content: req.body.content,
      link: req.body.link || "", // Asegurar que link también se pueda actualizar
      isMain: req.body.isMain === "true" || false, // Actualizar el campo isMain
    };

    if (req.file) {
      datosActualizados.image = `/uploads/${req.file.filename}`;
    }

    const noticiaActualizada = await Noticias.findByIdAndUpdate(
      req.params.id,
      datosActualizados,
      { new: true }
    );

    res.json(noticiaActualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar una noticia por ID
router.delete("/:id", async (req, res) => {
  try {
    await Noticias.findByIdAndDelete(req.params.id);
    res.json({ message: "Noticia eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
