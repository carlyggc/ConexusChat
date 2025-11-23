import { Router } from "express";
import passport from "../config/googleAuth.js";
import { generateToken, me } from "../controllers/authController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
  }
);

// endpoint to return user info from token
router.get("/me", verifyToken, me);

export default router;
