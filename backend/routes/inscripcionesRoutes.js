import express from "express";
import { crearInscripcion, obtenerInscripciones } from "../controllers/inscripcionController.js";

const router = express.Router();

router.post("/", crearInscripcion);
router.get("/", obtenerInscripciones);

export default router;
