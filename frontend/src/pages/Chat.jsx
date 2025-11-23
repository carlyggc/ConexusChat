import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import useWebSocket from "../hooks/useWebSocket";
import MessageInput from "../components/MessageInput";

export default function Chat() {
    const { channelId } = useParams();
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);

    // Cargar historial de mensajes
    useEffect(() => {
        api.get(`/chat/${channelId}`)
            .then(res => setMessages(res.data))
            .catch(err => console.error("Error cargando mensajes:", err));
    }, [channelId]);

    // WebSocket
    const { send } = useWebSocket((newMsg) => {
        if (newMsg.channel_id === Number(channelId)) {
            setMessages((prev) => [...prev, newMsg]);
        }
    });

    // Enviar mensaje
    const handleSend = async (content) => {
        if (!content.trim()) return;

        try {
            const res = await api.post("/chat/send", {
                channel_id: Number(channelId),
                content,
            });

            // Enviar datos por WebSocket a todos los clientes
            send(res.data);
        } catch (err) {
            console.error("Error enviando mensaje:", err);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Chat - Canal {channelId}</h2>

            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    height: "400px",
                    overflowY: "scroll",
                    marginBottom: "15px",
                }}
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            marginBottom: "10px",
                            textAlign: msg.sender_id === user.id ? "right" : "left",
                        }}
                    >
                        <div>
                            <b>{msg.sender_name || msg.sender_id}</b>
                        </div>
                        <div>{msg.content}</div>
                        <small style={{ fontSize: "10px", color: "#666" }}>
                            {msg.created_at}
                        </small>
                    </div>
                ))}
            </div>

            <MessageInput onSend={handleSend} />
        </div>
    );
}
