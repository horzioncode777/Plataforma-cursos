const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Consetic = require('../models/Consetic');

// Actualiza solo el videoConsejos del único documento
router.put('/videoconsejos', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const { videoUrl } = req.body;
    const videoFile = req.files['video'] ? `/uploads/${req.files['video'][0].filename}` : null;
    const thumbnailFile = req.files['thumbnail'] ? `/uploads/${req.files['thumbnail'][0].filename}` : null;

    const updateFields = {
      ...(videoFile && { 'videoConsejos.videoUrl': videoFile }),
      ...(thumbnailFile && { 'videoConsejos.thumbnail': thumbnailFile }),
    };

    const consetic = await Consetic.findOneAndUpdate({}, { $set: updateFields }, { new: true });
    res.json(consetic.videoConsejos);
  } catch (error) {
    console.error('Error al actualizar videoConsejos:', error);
    res.status(500).json({ message: 'Error al actualizar videoConsejos' });
  }
});

module.exports = router;
