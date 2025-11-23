import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header({ user }) {
  const { logout } = useContext(AuthContext);
  return (
    <div className="header" style={{
      background:"#698fe0ff", color:"#fff", padding:"12px 20px", display:"flex", justifyContent:"space-between", alignItems:"center"
    }}>
      <div style={{display:"flex", alignItems:"center", gap:12}}>
        <h3 style={{margin:0}}>Chat App</h3>
      </div>
      <div style={{display:"flex", alignItems:"center", gap:12}}>
        {user && (
          <>
            <img src={user.avatar} alt="avatar" style={{width:36,height:36,borderRadius:18}}/>
            <span>{user.name}</span>
          </>
        )}
        <button onClick={logout} style={{marginLeft:12, padding:"6px 10px", background:"#ef4444", color:"#fff", border:"none", borderRadius:8}}>Cerrar sesión</button>
      </div>
    </div>
  );
}
