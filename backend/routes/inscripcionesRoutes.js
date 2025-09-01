const express = require("express");
const router = express.Router();
const {
  crearInscripcion,
  obtenerInscripciones,
} = require("../controllers/inscripcionController");

router.post("/", crearInscripcion);
router.get("/", obtenerInscripciones);

module.exports = router;
