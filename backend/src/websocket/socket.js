import { WebSocketServer } from "ws";
import db from "../config/db.js";

// We'll maintain a Map of ws -> userId for presence
export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });
  const clients = new Map();

  wss.on("connection", (ws) => {
  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());

      // --- AUTENTICACIÓN SOCKET ---
      if (msg.type === "auth") {
        const userId = msg.userId;
        clients.set(ws, { userId, socket: ws });

        // actualizar last_seen
        db.run(
          "UPDATE users SET last_seen = datetime('now') WHERE id=?",
          [userId]
        );

        broadcastPresence();
        return;
      }

      // --- MENSAJE NORMAL ---
      else if (msg.type === "message") {
        const payload = msg.payload;
        const text = JSON.stringify({ type: "message", payload });

        wss.clients.forEach(client => {
          if (client.readyState === 1) client.send(text);
        });
      }
    } catch (e) {
      console.error("WS error", e);
    }
  });

  ws.on("close", () => {
    const info = clients.get(ws);

    if (info?.userId) {
      db.run(
        "UPDATE users SET last_seen = datetime('now') WHERE id=?",
        [info.userId]
      );
    }

    clients.delete(ws);
    broadcastPresence();
  });
});


  function broadcastPresence() {
    // build list of online user ids
    const online = new Set();
    for (const v of clients.values()) online.add(v.userId);
    const payload = JSON.stringify({ type: "presence", online: Array.from(online) });
    wss.clients.forEach(c => { if (c.readyState === 1) c.send(payload); });
  }
}
