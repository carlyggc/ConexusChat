export default function GoogleLoginButton() {
  const URL = import.meta.env.VITE_API_URL + "/auth/google";
  return (
    <a href={URL} className="google-btn" style={{
      padding:"10px 14px", background:"#4285f4", color:"white", borderRadius:8, display:"inline-block"
    }}>
      Iniciar sesión con Google
    </a>
  );
}
