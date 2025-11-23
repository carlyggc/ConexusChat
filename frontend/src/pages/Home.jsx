import { useState, useEffect } from "react";
import ChannelList from "../components/ChannelList";
import ChatRoom from "../components/ChatRoom";
import UserList from "../components/UserList";
import api from "../api/axiosConfig";
import Header from "../componentes/Header";
import "../styles.css";

export default function Home() {
  const [channelId, setChannelId] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [channels, setChannels] = useState([]);

  // Obtener usuario logueado
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        console.error("Error al obtener usuario:", err);
      }
    };
    fetchUser();
  }, []);

  // Cargar canales o crear por defecto
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await api.get("/channels");
        if (res.data.length > 0) {
          setChannels(res.data);
          setChannelId(res.data[0].id);
        } else {
          const defaultChannel = await api.post("/channels/create", { name: "General" });
          setChannels([defaultChannel.data]);
          setChannelId(defaultChannel.data.id);
        }
      } catch (err) {
        console.error("Error al cargar canales:", err);
      }
    };
    fetchChannels();
  }, []);

  return (
    <div className="layout">
      <Header user={user} />

      <div className="main-content">
        {/* Sidebar canales */}
        <div className="sidebar">
          <ChannelList
            channels={channels}
            onSelect={id => {
              setChannelId(id);
              setSelectedUserId(null);
            }}
          />
        </div>

        {/* Área de chat */}
        <div className="chat-area">
          {user ? (
            selectedUserId ? (
              <ChatRoom key={`user-${selectedUserId}`} directTo={selectedUserId} />
            ) : channelId ? (
              <ChatRoom key={`channel-${channelId}`} channelId={channelId} />
            ) : (
              <div className="empty">
                <h2>Selecciona un canal o un usuario</h2>
              </div>
            )
          ) : (
            <div className="loading">Cargando usuario...</div>
          )}
        </div>

        {/* Sidebar usuarios */}
        <div className="sidebar">
          <UserList
            onSelectUser={id => {
              setSelectedUserId(id);
              setChannelId(null);
            }}
          />
        </div>
      </div>
    </div>
  );
}
