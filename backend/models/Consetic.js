import mongoose from "mongoose";

const conseticSchema = new mongoose.Schema({
  // ajusta según tu definición actual
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  videoConsejos: {
    videoUrl: { type: String },
    thumbnail: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

const Consetic = mongoose.model("Consetic", conseticSchema);

export default Consetic;
