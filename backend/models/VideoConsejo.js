import mongoose from "mongoose";

const videoConsejoSchema = new mongoose.Schema(
  {
    videoUrl: { type: String, required: true },
    thumbnail: { type: String, required: true },
    titulo: { type: String, required: false }, // opcional
    descripcion: { type: String, required: false }, // opcional
  },
  { timestamps: true }
);

const VideoConsejo = mongoose.model("VideoConsejo", videoConsejoSchema);
export default VideoConsejo;
