import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


export const AppProvider = ({ children }) => {
  const [createrToken, setCreaterToken] = useState(
    localStorage.getItem("createrToken")
      ? localStorage.getItem("createrToken")
      : null,
  );

  const navigate = useNavigate();

  // Add logout function
  const logout = () => {
    setCreaterToken(null);
    localStorage.removeItem("createrToken");
    // Clear axios default headers if any
    delete axios.defaults.headers.common["Authorization"];
    delete axios.defaults.headers.common["creatertoken"];
    
    // Optional: Show logout message
    toast.success("Logged out successfully");
    
    // Navigate to home page
    navigate("/");
  };

  const value = {
    axios,
    createrToken,
    setCreaterToken,
    logout, // Add logout to context
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};