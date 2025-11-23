import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import db from "../config/db.js";

const router = Router();

router.get("/", verifyToken, (req,res)=>{
  db.all("SELECT * FROM channels ORDER BY id ASC", [], (err, rows) => res.json(rows));
});

router.post("/create", verifyToken, (req,res)=>{
  db.run("INSERT INTO channels(name, created_by) VALUES(?,?)",
    [req.body.name, req.user.id],
    function(){ res.json({ id: this.lastID, name: req.body.name }); });
});

export default router;
