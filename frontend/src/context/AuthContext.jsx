import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token){
      try {
        setUser(jwtDecode(token));
      } catch { localStorage.removeItem("token"); }
    }
  },[]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location = "/";
  };

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
};
