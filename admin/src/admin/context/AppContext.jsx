import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AppContext = createContext();

// 1. Create the instance
const adminAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:5000",
});

export const AppProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || "",
  );
  const [adminData, setAdminData] = useState(() => {
    const storedData = localStorage.getItem("adminData");
    return storedData ? JSON.parse(storedData) : null;
  });
  const [loading, setLoading] = useState(true);

  // 2. The Interceptor - This is the bridge that fixes the 401
  useEffect(() => {
    const requestInterceptor = adminAxiosInstance.interceptors.request.use(
      (config) => {
        if (adminToken) {
          // This must match 'admintoken' in your backend middleware
          config.headers.admintoken = adminToken;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    return () =>
      adminAxiosInstance.interceptors.request.eject(requestInterceptor);
  }, [adminToken]);

  // 3. Sync to LocalStorage
  useEffect(() => {
    if (adminToken) {
      localStorage.setItem("adminToken", adminToken);
      console.log(adminToken);
    } else {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      setAdminData(null);
    }
  }, [adminToken]);

  // 4. Sync adminData to localStorage
  useEffect(() => {
    if (adminData) {
      localStorage.setItem("adminData", JSON.stringify(adminData));
    } else {
      localStorage.removeItem("adminData");
    }
  }, [adminData]);

  // 5. Fetch admin profile when token exists but no adminData
  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (adminToken && !adminData) {
        console.log("Fetching admin profile...");
        setLoading(true);
        try {
          const response = await adminAxiosInstance.get("/api/admin/profile");
          if (response.data.success) {
            setAdminData(response.data.admin);
          }
        } catch (error) {
          console.error("Failed to fetch admin profile:", error);
          if (error.response?.status === 401) {
            adminLogout();
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [adminToken]);

  const adminLogin = (token, userData) => {
    setAdminToken(token);
    setAdminData(userData);
    toast.success("Logged in successfully");
  };

  const adminLogout = () => {
    setAdminToken("");
    setAdminData(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    toast.success("Logged out successfully");
  };

  const updateAdminProfile = (updatedData) => {
    setAdminData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
    toast.success("Profile updated successfully");
  };

  const value = {
    axios: adminAxiosInstance, // Components use this
    adminToken,
    adminData,
    loading,
    setAdminToken,
    adminLogin,
    adminLogout,
    updateAdminProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);