import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || null
  );

  const login = async (email, password) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/users/login`,
      { email, password }
    );

    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/users/register`,
      { name, email, password }
    );

    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};