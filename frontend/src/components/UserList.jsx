import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function UserList({ onSelect }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/users").then(res => setUsers(res.data));
  }, []);
  useEffect(() => {
  const load = () => api.get("/users/presence").then(res => setUsers(res.data));
  load();
  const i = setInterval(load, 3000);
  return () => clearInterval(i);
}, []);

  return (
    <div className="user-list">
      <h4>Usuarios</h4>
      {users.map(u => (
        <div>
        <p key={u.id} onClick={() => onSelect(u.id)}>
          💬 {u.name}
        </p>
        <p key={u.id} onClick={() => onSelect(u.id)}>
         {u.online ? "🟢" : "⚪"} {u.name}
         
         </p>
        </div>
      ))}
    </div>
  );
}
