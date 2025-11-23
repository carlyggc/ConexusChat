import { useState, useEffect, useContext } from "react";
import useWebSocket from "../hooks/useWebSocket";
import api from "../api/axiosConfig";
import MessageInput from "./MessageInput";
import { AuthContext } from "../context/AuthContext";

export default function ChatRoom({ channelId = null, directTo = null }) {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);

  // WebSocket
  const { send } = useWebSocket(newMsg => {
    if (
      (channelId && newMsg.channel_id === channelId) ||
      (directTo &&
        ((newMsg.sender_id === directTo && newMsg.receiver_id === user.id) ||
         (newMsg.sender_id === user.id && newMsg.receiver_id === directTo)))
    ) {
      setMessages(prev => [...prev, newMsg]);
    }
  });

  // Cargar mensajes
  useEffect(() => {
    if (!channelId && !directTo) return;

    const fetchMessages = async () => {
      try {
        const endpoint = directTo ? `/chat/private/${directTo}` : `/chat/${channelId}`;
        const res = await api.get(endpoint);
        const data = Array.isArray(res.data) ? res.data : res.data.messages || [];
        setMessages(data);
      } catch (err) {
        console.error("Error al cargar mensajes:", err);
      }
    };

    fetchMessages();
  }, [channelId, directTo]);

  // Enviar mensaje
  const handleSend = async content => {
    if (!content.trim()) return;

    const payload = { content };
    if (directTo) payload.receiver_id = directTo;
    else payload.channel_id = channelId;

    try {
      const res = await api.post("/chat/send", payload);
      setMessages(prev => [...prev, res.data]);
      send(res.data);
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
    }
  };

  return (
    <div className="chat-room">
      <div className="chat-messages">
        {messages.length > 0 ? (
          messages.map(m => (
            <p key={`msg-${m.id}`}>
              <b>{m.sender_name || m.sender_id}</b>: {m.content}
            </p>
          ))
        ) : (
          <p className="empty-msg">No hay mensajes aún.</p>
        )}
      </div>

      <MessageInput onSend={handleSend} />
    </div>
  );
}
