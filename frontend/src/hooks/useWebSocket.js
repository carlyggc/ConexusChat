import { useEffect, useRef, useCallback } from "react";

export default function useWebSocket(onEvent) {
  const socketRef = useRef(null);
  const reconnectTimer = useRef(null);

  // Función para conectar
  const connect = useCallback(() => {
    socketRef.current = new WebSocket("ws://localhost:3000");

    socketRef.current.onopen = () => {
      console.log("WebSocket conectado");
      // Enviar auth con token
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          socketRef.current.send(JSON.stringify({ type: "auth", userId: payload.id }));
        } catch (err) {
          console.error("Error parseando token JWT:", err);
        }
      }
    };

    socketRef.current.onmessage = e => {
      try {
        const data = JSON.parse(e.data);
        if (onEvent) onEvent(data);
      } catch (err) {
        console.error("Error parseando mensaje WS:", err);
      }
    };

    socketRef.current.onerror = err => {
      console.error("WebSocket error:", err);
    };

    socketRef.current.onclose = () => {
      console.warn("WebSocket cerrado, intentando reconectar en 2s...");
      reconnectTimer.current = setTimeout(connect, 2000);
    };
  }, [onEvent]);

  // Conectar al montar
  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      if (socketRef.current) socketRef.current.close();
    };
  }, [connect]);

  // Función para enviar mensaje
  const send = useCallback(obj => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(obj));
    } else {
      console.warn("WebSocket no está abierto, mensaje no enviado:", obj);
    }
  }, []);

  return { send };
}
