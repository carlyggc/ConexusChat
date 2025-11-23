import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || "user",
    avatar: user.avatar || null
  }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// /auth/me
export const me = (req, res) => {
  // middleware verifyToken sets req.user
  res.json({ user: req.user });
};
