import { createContext } from "react";

export interface User {
  id: number;
  fullName: string;
  username: string;
}

export interface LogoutResult {
  error: boolean;
  message: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<LogoutResult>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
