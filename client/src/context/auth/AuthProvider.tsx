import { useEffect, useState } from "react";
import getMe from "@/api/auth/getMe";
import logoutApi from "@/api/auth/logout.api.ts";
import { AuthContext, type User, type AuthContextType } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    try {
      const result = await getMe();
      setLoading(true);

      if (!result.error) {
        setUser(result.user);
        return;
      }

      if (result.status === 429) {
        console.log(result.message || "Too Many Requests", "warning");
      }

      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
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
