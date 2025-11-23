import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function ChannelList({ onSelect }) {
  const [channels, setChannels] = useState([]);
  const [name, setName] = useState("");

  const load = () => api.get("/channels").then(res => setChannels(res.data));

  useEffect(load, []);

  const createChannel = async () => {
    if(!name.trim()) return;

    const res = await api.post("/channels/create", { name });
    setChannels(prev => [...prev, res.data]);
    setName("");
  };

  return (
    <div className="channel-list">
      <h4>Canales</h4>
      {channels.map(c => (
        <p key={c.id} onClick={() => onSelect(c.id)}>
          # {c.name}
        </p>
      ))}

      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del canal" />
      <button onClick={createChannel}>Crear canal</button>
    </div>
  );
}
