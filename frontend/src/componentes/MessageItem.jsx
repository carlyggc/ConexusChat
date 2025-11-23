export default function MessageItem({ m }) {
  return (
    <div style={{marginBottom:8}}>
      <div style={{fontSize:12, color:"#555"}}>
        <strong>{m.sender_name}</strong> <small style={{color:"#999"}}>{new Date(m.created_at).toLocaleTimeString()}</small>
      </div>
      <div>{m.content}</div>
    </div>
  );
}
