const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🛠️ Middleware en orden correcto
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5174", // 🔁 Cambia al puerto real del frontend
  credentials: true
}));
app.use(express.json());

// Archivos estáticos
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/cursos", express.static(path.join(__dirname, "public/cursos")));

// Conexión MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ ERROR: La variable MONGO_URI no está definida en .env");
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ Error de conexión a MongoDB:", err.message);
    process.exit(1);
  });

// Rutas
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const noticiasRoutes = require("./routes/noticiasRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const masConsejosRoutes = require("./routes/masConsejosRoutes");
const videoConsejosRoutes = require("./routes/videoconsejos");
const conseticRoutes = require("./routes/conseticroutes");
const uploadRoute = require("./routes/upload");
const citizenRoutes = require("./routes/CitizenRoutes");
const misCursosRoutes = require("./routes/misCursosRoutes");
const adminUsuariosRoutes = require("./routes/adminUsuarios");
const modulosRouter = require("./routes/modulos");

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
app.use("/modulos", require("./routes/modulos")); // 🔐 Protección por cookie

app.use("/api/courses/protected", authMiddleware, courseRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Servidor funcionando correctamente");
});

app.use((req, res) => {
  res.status(404).json({ message: "❌ Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
  