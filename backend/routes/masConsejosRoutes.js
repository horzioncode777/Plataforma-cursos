import express from "express";
import MasConsejo from "../models/MasConsejo.js";

const router = express.Router();

// GET todos los MAS CONSEJOS
router.get("/", async (req, res) => {
  try {
    const consejos = await MasConsejo.find();
    res.json(consejos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST agregar nuevo
router.post("/", async (req, res) => {
  const { titulo, descripcion, imagen } = req.body;
  try {
    const nuevo = new MasConsejo({ titulo, descripcion, imagen });
    await nuevo.save();
    res.json(nuevo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT editar por ID
router.put("/:id", async (req, res) => {
  try {
    const actualizado = await MasConsejo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE eliminar por ID
router.delete("/:id", async (req, res) => {
  try {
    await MasConsejo.findByIdAndDelete(req.params.id);
    res.json({ message: "Consejo eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
