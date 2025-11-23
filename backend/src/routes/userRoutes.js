import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import db from "../config/db.js";

const router = Router();

router.get("/", verifyToken, (req, res) => {
  db.all("SELECT id, name FROM users", [], (err, rows) => {
    if(err) return res.status(500).json({error: err});
    res.json(rows);
  });
});

router.get("/presence", verifyToken, (req, res) => {
  db.all(`
    SELECT id, name,
      (strftime('%s','now') - strftime('%s', last_seen)) < 10 AS online
    FROM users
  `, [], (err, rows) => {
    if(err) return res.status(500).json({error: err});
    res.json(rows);
  });
});

export default router;
