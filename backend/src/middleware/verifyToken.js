import jwt from "jsonwebtoken";
import db from "../config/db.js";

export default function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    // attach decoded
    req.user = decoded;
    next();
  });
}
