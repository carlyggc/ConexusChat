import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import db from "../config/db.js";

const router = Router();

// Obtener mensajes de canal
router.get("/:channelId", verifyToken, (req, res) => {
  const channelId = Number(req.params.channelId);
  db.all(
    `SELECT m.*, u.name as sender_name 
     FROM messages m 
     LEFT JOIN users u ON m.sender_id = u.id
     WHERE m.channel_id = ? 
     ORDER BY m.created_at ASC`,
    [channelId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Obtener mensajes privados
router.get("/private/:otherUserId", verifyToken, (req, res) => {
  const me = req.user.id;
  const other = Number(req.params.otherUserId);

  db.all(
    `SELECT m.*, u.name as sender_name 
     FROM messages m 
     LEFT JOIN users u ON m.sender_id = u.id
     WHERE (m.sender_id=? AND m.receiver_id=?) OR (m.sender_id=? AND m.receiver_id=?)
     ORDER BY m.created_at ASC`,
    [me, other, other, me],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Enviar mensaje
router.post("/send", verifyToken, (req, res) => {
  const { channel_id, receiver_id, content } = req.body;

  db.run(
    "INSERT INTO messages(sender_id, receiver_id, channel_id, content) VALUES(?,?,?,?)",
    [req.user.id, receiver_id || null, channel_id || null, content],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get(
        `SELECT m.*, u.name as sender_name 
         FROM messages m 
         LEFT JOIN users u ON m.sender_id = u.id
         WHERE m.id = ?`,
        [this.lastID],
        (err2, row) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json(row);
        }
      );
    }
  );
});

export default router;
