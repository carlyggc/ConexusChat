import { useState, useEffect, useContext } from "react";
import api from "../api/axiosConfig";
import MessageItem from "./MessageItem";
import useWebSocket from "../hooks/useWebSocket";
import { AuthContext } from "../context/AuthContext";

export default function ChatBox({ channelId, mode="channel", otherUserId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(()=>{
    if(!channelId && !otherUserId) return;
    const url = mode==="channel" ? `/chat/${channelId}` : `/chat/private/${otherUserId}`;
    api.get(url).then(res => setMessages(res.data));
  },[channelId, otherUserId]);

  const { send } = useWebSocket((ev)=>{
    if(ev.type === "message") {
      const payload = ev.payload;
      // when websocket receives a message, push it if relevant
      if(mode==="channel" && payload.channel_id===channelId) setMessages(prev=>[...prev, payload]);
      if(mode==="private") {
        const me = user?.id;
        if(payload.receiver_id===me || payload.sender_id===me) setMessages(prev=>[...prev, payload]);
      }
    }
  });

  const handleSend = async () => {
    if(!text.trim()) return;
    const body = mode==="channel" ? { channel_id: channelId, content: text } : { receiver_id: otherUserId, content: text };
    const res = await api.post("/chat/send", body);
    // send over websocket for real-time
    send({ type: "message", payload: res.data });
    setMessages(prev => [...prev, res.data]);
    setText("");
  };

  return (
    <div style={{display:"flex", flexDirection:"column", height:"100%"}}>
      <div style={{flex:1, overflowY:"auto", padding:12, background:"#fff", borderRadius:8}}>
        {messages.map(m => <MessageItem key={m.id} m={m} />)}
      </div>

      <div style={{display:"flex", gap:8, marginTop:8}}>
        <input value={text} onChange={(e)=>setText(e.target.value)} style={{flex:1, padding:10, borderRadius:8}} placeholder="Escribe un mensaje..." />
        <button onClick={handleSend} style={{padding:"10px 16px", background:"#2563eb", color:"#fff", borderRadius:8}}>Enviar</button>
      </div>
    </div>
  );
}
