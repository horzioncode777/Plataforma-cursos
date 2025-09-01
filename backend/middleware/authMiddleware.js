import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Asegúrate de que el token se reciba correctamente

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado, token requerido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || "secreto"); // Usa la misma clave secreta
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Token no válido", error: error.message });
  }
};

export default authMiddleware;
