import http from "http";
import app from "./app.js";
import { setupWebSocket } from "./src/websocket/socket.js";
import 'dotenv/config';

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

setupWebSocket(server);

server.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
