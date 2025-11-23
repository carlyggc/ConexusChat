import { useEffect, useRef } from "react";

export default function useWebSocket(onEvent) {
  const socketRef = useRef(null);
  useEffect(()=>{
    socketRef.current = new WebSocket("ws://localhost:3000");
    socketRef.current.onopen = ()=> {
      // send auth with user id if available
      const token = localStorage.getItem("token");
      if(token){
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          socketRef.current.send(JSON.stringify({ type: "auth", userId: payload.id }));
        } catch {}
      }
    };
    socketRef.current.onmessage = (e) => {
      try { const data = JSON.parse(e.data); onEvent && onEvent(data); }
      catch(e){ console.error(e); }
    };
    socketRef.current.onerror = (e)=> console.error("ws err", e);
    return ()=> socketRef.current && socketRef.current.close();
  }, []);
  const send = (obj) => {
    if(socketRef.current && socketRef.current.readyState === 1) socketRef.current.send(JSON.stringify(obj));
  };
  return { send };
}
