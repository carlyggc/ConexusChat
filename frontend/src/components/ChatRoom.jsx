import { useState, useEffect, useContext } from "react";
import useWebSocket from "../hooks/useWebSocket";
import api from "../api/axiosConfig";
import MessageInput from "./MessageInput";
import { AuthContext } from "../context/AuthContext";

export default function ChatRoom({ channelId = null, directTo = null }) {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);

  // WebSocket para recibir mensajes en tiempo real
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

  // Cargar mensajes al entrar al chat
  useEffect(() => {
    if (!channelId && !directTo) return;

    const endpoint = directTo ? `/chat/private/${directTo}` : `/chat/${channelId}`;

    api.get(endpoint)
      .then(res => {
        let data = [];
        if (Array.isArray(res.data)) data = res.data;
        else if (Array.isArray(res.data.messages)) data = res.data.messages;
        setMessages(data);
      })
      .catch(err => console.error("Error al cargar mensajes:", err));
  }, [channelId, directTo]);

  // Enviar mensaje
  const handleSend = async content => {
    if (!content.trim()) return;

    const payload = { content };
    if (directTo) payload.receiver_id = directTo;
    else payload.channel_id = channelId;

    try {
      const res = await api.post("/chat/send", payload);
      // Actualizar localmente
      setMessages(prev => [...prev, res.data]);
      // Enviar por WebSocket
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
            <p key={m.id}>
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
