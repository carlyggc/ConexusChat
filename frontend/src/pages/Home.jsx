import { useState, useEffect } from "react";
import ChannelList from "../components/ChannelList";
import ChatRoom from "../components/ChatRoom";
import UserList from "../components/UserList";
import api from "../api/axiosConfig";
import Header from "../componentes/Header"; // nuevo
import "../styles.css"; // estilos modernos

export default function Home() {
  const [channelId, setChannelId] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Obtener usuario logueado con JWT
  useEffect(() => {
    api.get("/auth/me")
      .then(res => setUser(res.data.user))
      .catch(err => console.error("Error al obtener usuario:", err));
  }, []);

  // Crear canal por defecto si no existen
  const createDefaultChannel = async () => {
    try {
      const res = await api.post("/channels/create", { name: "General" });
      setChannelId(res.data.id);
    } catch (err) {
      console.error("Error al crear canal por defecto:", err);
    }
  };

  // Cargar canales
  useEffect(() => {
    api.get("/channels")
      .then(res => {
        if (res.data.length > 0) {
          setChannelId(res.data[0].id);
        } else {
          createDefaultChannel();
        }
      })
      .catch(err => console.error("Error al cargar canales:", err));
  }, []);

  return (
    <div className="layout">

      {/* --- HEADER GLOBAL --- */}
      <Header user={user} />

      <div className="main-content">

        {/* --- SIDEBAR CANALES --- */}
        <div className="sidebar">
          <ChannelList onSelect={id => {
            setChannelId(id);
            setSelectedUserId(null); // Limpiar chat directo
          }} />
        </div>

        {/* --- CHAT --- */}
        <div className="chat-area">
          {selectedUserId ? (
            <ChatRoom directTo={selectedUserId} />
          ) : channelId ? (
            <ChatRoom channelId={channelId} />
          ) : (
            <div className="empty">
              <h2>Selecciona un canal o un usuario</h2>
            </div>
          )}
        </div>

        {/* --- SIDEBAR USUARIOS --- */}
        <div className="sidebar">
          <UserList onSelectUser={id => {
            setSelectedUserId(id);
            setChannelId(null); // Limpiar canal
          }} />
        </div>

      </div>
    </div>
  );
}
