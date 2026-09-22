import { createContext, useContext, useEffect, useState } from "react";
import getMe from "../api/auth/getMe";
import logoutApi from "../api/auth/logout.api.ts";
import { useToast } from "./ToastProvider.tsx";

interface User {
  fullName: string;
  email: string;
}
interface LogoutResult {
  error: boolean;
  message: string;
}
interface AuthContextType {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<LogoutResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    const result = await getMe();
    console.log(result);

    if (!result.error) {
      setUser(result.user);
    } else {
      if (result.status === 429) {
        console.log(result.message || "Too Many Requests", "warning");
      }
      setUser(null);
    }
  }

  useEffect(() => {
    async function initializeAuth() {
      try {
        await loadUser();
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();
  }, []);

  async function refreshUser() {
    await loadUser();
  }

  async function logout() {
    try {
      const result = await logoutApi();

      if (result.error) {
        return result;
      }

      setUser(null);

      return result;
    } catch (error) {
      return {
        error: true,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    authenticated: user !== null,
    refreshUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
