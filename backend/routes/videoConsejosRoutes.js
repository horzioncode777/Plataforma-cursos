import express from "express";
import upload from "../middleware/uploadVideos.js"; // ✅ nuevo middleware
import Consetic from "../models/Consetic.js";

const router = express.Router();

// 🔹 Ruta PUT para subir videoConsejos
router.put(
  "/",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const videoFile = req.files["video"] ? `/uploads/${req.files["video"][0].filename}` : null;
      const thumbnailFile = req.files["thumbnail"]
        ? `/uploads/${req.files["thumbnail"][0].filename}`
        : null;

      const updateFields = {
        ...(videoFile && { "videoConsejos.videoUrl": videoFile }),
        ...(thumbnailFile && { "videoConsejos.thumbnail": thumbnailFile }),
      };

      const updatedDoc = await Consetic.findOneAndUpdate({}, { $set: updateFields }, { new: true });

      res.json({
        message: "✅ VideoConsejos actualizado correctamente",
        data: updatedDoc.videoConsejos,
      });
    } catch (error) {
      console.error("❌ Error al actualizar videoConsejos:", error);
      res.status(500).json({ message: "❌ Error al actualizar videoConsejos" });
    }
  }
);

// 🔹 Ruta GET para obtener videoConsejos
router.get("/", async (req, res) => {
  try {
    const consetic = await Consetic.findOne(); // Asumimos que solo hay un documento
    if (!consetic || !consetic.videoConsejos) {
      return res.status(404).json({ message: "❌ No hay datos de videoConsejos" });
    }

    res.json(consetic.videoConsejos);
  } catch (error) {
    console.error("❌ Error al obtener videoConsejos:", error);
    res.status(500).json({ message: "❌ Error al obtener videoConsejos" });
  }
});

export default router;
