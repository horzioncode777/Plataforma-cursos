import jwt from "jsonwebtoken";
import Citizen from "../models/Citizen.js";

const authCitizen = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.query.token;

    if (!token) {
      return res.status(401).json({ message: "Acceso denegado: no hay token" });
    }

    // 🔐 Verificación de la clave secreta
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      console.error("❌ SECRET_KEY no está definido en las variables de entorno");
      return res.status(500).json({ message: "Falta clave secreta del servidor" });
    }

    const decoded = jwt.verify(token, secretKey);
    const citizen = await Citizen.findById(decoded.id).select("-password");

    if (!citizen) {
      return res.status(404).json({ message: "Ciudadano no encontrado" });
    }

    req.citizen = citizen;
    next();
  } catch (error) {
    console.error("Error en middleware authCitizen:", error);
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export default authCitizen;
