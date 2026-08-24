import { createContext, useContext, useState, useEffect } from "react";
import api from "../Service/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setToken(parsed.token);
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post("/users/login", { email, password });
    const data = { _id: res.data._id, name: res.data.name, email: res.data.email, profileImage: res.data.profileImage, token: res.data.token };
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    setToken(data.token);
    return data;
  };

  const signup = async (name, email, password) => {
    const res = await api.post("/users/signup", { name, email, password });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
  };

  const fetchProfile = async () => {
    const res = await api.get("/users/profile");
    return res.data;
  };

  const updateProfile = async (data) => {
    const res = await api.put("/users/profile", data);
    updateUser({ name: res.data.name, profileImage: res.data.profileImage });
    return res.data;
  };

  const updatePassword = async (currentPassword, newPassword) => {
    const res = await api.put("/users/password", { currentPassword, newPassword });
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        signup,
        logout,
        updateUser,
        fetchProfile,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
