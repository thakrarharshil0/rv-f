import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";
const AuthContext = createContext(void 0);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem("fitfloor-token");
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }

      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const data = await api.auth.me();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch {
        localStorage.removeItem("fitfloor-token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async ({ email, password, name, isLogin = true }) => {
    const endpoint = isLogin ? api.auth.login : api.auth.register;
    const payload = isLogin
      ? { email, password }
      : { name: (name || "John User").trim(), email, password };

    const data = await endpoint(payload);

    localStorage.setItem("fitfloor-token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("fitfloor-token");
    localStorage.removeItem("user");
  };

  return <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isAuthLoading }}>
            {children}
        </AuthContext.Provider>;
};
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export {
  AuthProvider,
  useAuth
};
