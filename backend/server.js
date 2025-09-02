import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🛠️ Middleware
app.use(cookieParser());
app.use(express.json());

// 🔹 Configuración CORS dinámica
const allowedOrigins = [
  "http://localhost:5173", // dev (Vite)
  "http://localhost:5174", // dev alternativo
  "https://plataforma-cursos-sage.vercel.app", // producción en Vercel
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman, curl, SSR
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ No permitido por CORS: " + origin));
      }
    },
    credentials: true,
  })
);

// ⚠️ Archivos estáticos locales (NO persistentes en Render, pero los dejamos para dev)
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 
app.use("/cursos", express.static(path.join(__dirname, "public/cursos")));

// 🔗 Conexión a MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ ERROR: La variable MONGO_URI no está definida en .env");
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ Error de conexión a MongoDB:", err.message);
    process.exit(1);
  });

// 📌 Rutas
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import noticiasRoutes from "./routes/noticiasRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import masConsejosRoutes from "./routes/masConsejosRoutes.js";
import videoConsejosRoutes from "./routes/videoconsejos.js";
import conseticRoutes from "./routes/conseticroutes.js";
import uploadRoute from "./routes/upload.js"; // ahora con Cloudinary
import citizenRoutes from "./routes/CitizenRoutes.js";
import misCursosRoutes from "./routes/misCursosRoutes.js";
import adminUsuariosRoutes from "./routes/adminUsuarios.js";
import modulosRouter from "./routes/modulos.js";

app.use("/api/upload", uploadRoute);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/noticias", noticiasRoutes);
app.use("/api/masconsejos", masConsejosRoutes);
app.use("/api/videoconsejos", videoConsejosRoutes);
app.use("/api", conseticRoutes);
app.use("/api/citizen", citizenRoutes);
app.use("/api/miscursos", misCursosRoutes);
app.use("/api", adminUsuariosRoutes);
app.use("/api/modulos", modulosRouter);
app.use("/modulos", modulosRouter);

app.use("/api/courses/protected", authMiddleware, courseRoutes);

// 🔎 Ruta de prueba
app.get("/api/test", (req, res) => {
  res.json({
    ok: true,
    message: "🚀 Backend en Render funcionando correctamente",
    timestamp: new Date(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "❌ Ruta no encontrada" });
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
