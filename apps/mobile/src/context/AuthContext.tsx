import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  sendOtp: (phone: string) => Promise<{ success: boolean; error?: string; debugOtp?: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    async function restoreSession() {
      try {
        const cachedToken = await api.loadCachedToken();
        const cachedUser = await api.getCachedUser();

        if (cachedToken && cachedUser) {
          setToken(cachedToken);
          setUser(cachedUser);
        }
      } catch (err) {
        console.warn("Failed to restore session:", err);
      } finally {
        setIsInitialized(true);
      }
    }

    restoreSession();
  }, []);

  const sendOtp = async (phone: string) => {
    setIsLoading(true);
    try {
      const res = await api.sendOtp(phone);
      return {
        success: res.success,
        error: res.error,
        debugOtp: res.debugOtp,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    setIsLoading(true);
    try {
      const res = await api.verifyOtp(phone, otp);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.error || "Verification failed." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.clearAuth();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isInitialized,
        sendOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
