const VideoConsejo = require("../models/VideoConsejo");

// Obtener todos los video consejos
const getAllVideoConsejos = async (req, res) => {
  try {
    const consejos = await VideoConsejo.find();
    res.status(200).json(consejos);
  } catch (err) {
    console.error("❌ Error al obtener videoConsejos:", err);
    res.status(500).json({ error: "Error al obtener los videoConsejos" });
  }
};

// Crear nuevo video consejo
const createVideoConsejo = async (req, res) => {
  try {
    const videoFile = req.files?.["video"]?.[0];
    const thumbnailFile = req.files?.["thumbnail"]?.[0];

    if (!videoFile || !thumbnailFile) {
      return res.status(400).json({ error: "Se requiere video y thumbnail" });
    }

    const nuevo = new VideoConsejo({
      videoUrl: `/uploads/${videoFile.filename}`,
      thumbnail: `/uploads/${thumbnailFile.filename}`,
    });

    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    console.error("❌ Error al crear video consejo:", err);
    res.status(500).json({ error: "Error al crear el video consejo" });
  }
};

// Actualizar video consejo
const updateVideoConsejo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};

    if (req.files?.["video"]) {
      updates.videoUrl = `/uploads/${req.files["video"][0].filename}`;
    }
    if (req.files?.["thumbnail"]) {
      updates.thumbnail = `/uploads/${req.files["thumbnail"][0].filename}`;
    }

    const actualizado = await VideoConsejo.findByIdAndUpdate(id, updates, { new: true });

    if (!actualizado) {
      return res.status(404).json({ error: "Video consejo no encontrado" });
    }

    res.status(200).json(actualizado);
  } catch (err) {
    console.error("❌ Error al actualizar video consejo:", err);
    res.status(500).json({ error: "Error al actualizar el video consejo" });
  }
};

// Eliminar video consejo
const deleteVideoConsejo = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await VideoConsejo.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ error: "Video consejo no encontrado" });
    }

    res.status(200).json({ message: "Video consejo eliminado" });
  } catch (err) {
    console.error("❌ Error al eliminar video consejo:", err);
    res.status(500).json({ error: "Error al eliminar el video consejo" });
  }
};

module.exports = {
  getAllVideoConsejos,
  createVideoConsejo,
  updateVideoConsejo,
  deleteVideoConsejo,
};
