import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if(token){
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      navigate("/home");
    }
  },[]);

  return (
    <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"linear-gradient(90deg,#4a90e2,#9013fe)"}}>
      <div style={{background:"#fff", padding:30, borderRadius:12, boxShadow:"0 8px 30px rgba(0,0,0,0.12)"}}>
        <h2>Bienvenido</h2>
        <p>Inicia sesión con Google</p>
        <GoogleLoginButton/>
      </div>
    </div>
  );
}
