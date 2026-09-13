import { createContext, useContext, useEffect, useState } from "react";

import getMe from "../api/getMe";

interface User {
  id: number;
  full_name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    const result = await getMe();

    if (!result.error) {
      setUser(result.user);
    } else {
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
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
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
