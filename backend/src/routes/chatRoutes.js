import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import db from "../config/db.js";

const router = Router();

// mensajes de canal
router.get("/:channelId", verifyToken, (req,res)=>{
  db.all(
    `SELECT m.*, u.name as sender_name, u.avatar as sender_avatar
     FROM messages m
     LEFT JOIN users u ON m.sender_id = u.id
     WHERE m.channel_id=? ORDER BY m.created_at ASC`,
    [req.params.channelId],
    (err, rows) => res.json(rows)
  );
});

// mensajes privados 1:1 (conversation between req.user and other)
router.get("/private/:otherUserId", verifyToken, (req,res)=>{
  const me = req.user.id;
  const other = Number(req.params.otherUserId);
  db.all(
    `SELECT m.*, u.name as sender_name, u.avatar as sender_avatar
     FROM messages m
     LEFT JOIN users u ON m.sender_id = u.id
     WHERE (m.sender_id=? AND m.receiver_id=?) OR (m.sender_id=? AND m.receiver_id=?)
     ORDER BY m.created_at ASC`,
    [me, other, other, me],
    (err, rows) => res.json(rows)
  );
});

// enviar mensaje (canal o privado)
router.post("/send", verifyToken, (req,res)=>{
  const { channel_id, receiver_id, content } = req.body;
  db.run(
    "INSERT INTO messages(sender_id, receiver_id, channel_id, content) VALUES(?,?,?,?)",
    [req.user.id, receiver_id || null, channel_id || null, content],
    function() {
      db.get(
        `SELECT m.*, u.name as sender_name, u.avatar as sender_avatar
         FROM messages m
         LEFT JOIN users u ON m.sender_id=u.id
         WHERE m.id=?`,
        [this.lastID],
        (err,row) => res.json(row)
      );
    }
  );
});

// borrar mensaje (solo admin)
router.delete("/delete/:id", verifyToken, verifyAdmin, (req,res)=>{
  db.run("DELETE FROM messages WHERE id=?", [req.params.id], function() {
    res.json({ ok: true });
  });
});

export default router;
