import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  image: { type: String, default: "" }, // Si no se proporciona, queda vacío
  date: { type: Date, default: Date.now },
  content: { type: String, default: "" },
  link: { type: String, default: "" }, // Enlace opcional
  isMain: { type: Boolean, default: false }, // Por defecto falso
});

const News = mongoose.model("News", newsSchema);
export default News;
