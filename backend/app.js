import express from "express";
import cors from "cors";
import 'dotenv/config';
import passport from "passport";

import authRoutes from "./src/routes/authRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import channelRoutes from "./src/routes/channelRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import "./src/config/googleAuth.js"; // ensure passport strategies loaded

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/channels", channelRoutes);
app.use("/users", userRoutes);

app.get("/health", (req,res)=>res.json({status:"ok"}));

export default app;
