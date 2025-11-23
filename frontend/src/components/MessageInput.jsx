import { useState } from "react";

export default function MessageInput({ onSend }) {
  const [text,setText] = useState("");
  const sendMessage = ()=>{ if(!text.trim()) return; onSend(text); setText(""); };
  return <div style={{display:"flex",gap:"10px"}}>
    <input value={text} onChange={e=>setText(e.target.value)}
      onKeyDown={e=>e.key==="Enter" && sendMessage()} placeholder="Escribe un mensaje..." 
      style={{flex:1,padding:"10px",borderRadius:"5px",border:"1px solid #ccc"}}/>
    <button onClick={sendMessage} style={{padding:"10px 15px", background:"#1976d2", color:"#fff", border:"none", borderRadius:"5px", cursor: "pointer"}}>Enviar</button>
  </div>;
}
