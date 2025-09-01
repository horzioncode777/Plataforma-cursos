const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  image: { type: String, default: "" }, // Si no se proporciona, queda vacío
  date: { type: Date, default: Date.now },
  content: { type: String, default: "" },
  link: { type: String, default: "" }, // Enlace opcional, queda vacío si no se pone
  isMain: { type: Boolean, default: false } // Valor booleano, por defecto falso
});

const News = mongoose.model("News", newsSchema);

module.exports = News;
