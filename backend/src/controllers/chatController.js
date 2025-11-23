import db from "../config/db.js";

export const sendMessage = (req, res) => {
    const { receiver_id, channel_id, content } = req.body;

    db.run(
        "INSERT INTO messages(sender_id, receiver_id, channel_id, content) VALUES(?,?,?,?)",
        [req.user.id, receiver_id, channel_id, content],
        function () {
            res.json({ id: this.lastID, sender_id: req.user.id, content });
        }
    );
};

export const getMessages = (req, res) => {
    db.all(
     `SELECT m.*, u.name as sender_name 
      FROM messages m 
      LEFT JOIN users u ON m.sender_id = u.id 
      WHERE m.channel_id=? 
      ORDER BY m.created_at ASC`,
     [req.params.channelId],
     (err, rows) => res.json(rows)
 );
};
