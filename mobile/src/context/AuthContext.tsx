import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, PairingPayload } from "../types";
import { api } from "../api/client";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  serverUrl: string | null;
  token: string | null;
  pairWithQr: (qrString: string) => Promise<void>;
  login: (serverUrl: string, email: string, pwd: string) => Promise<void>;
  logout: () => Promise<void>;
}

const STORAGE_KEYS = {
  SERVER_URL: "@nudgepath_server_url",
  TOKEN: "@nudgepath_token",
  USER: "@nudgepath_user",
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    bootstrapAuth();
  }, []);

  const bootstrapAuth = async () => {
    try {
      const [savedUrl, savedToken, savedUser] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SERVER_URL),
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
      ]);

      if (savedUrl && savedToken) {
        api.configure({ baseUrl: savedUrl, token: savedToken });
        setServerUrl(savedUrl);
        setToken(savedToken);

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        // Validate token in background
        try {
          const freshUser = await api.verifyToken(savedUrl, savedToken);
          setUser(freshUser);
          await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(freshUser));
        } catch {
          // Token expired or server changed
          await logout();
        }
      }
    } catch (e) {
      console.error("[AuthContext] Bootstrap error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const pairWithQr = async (qrString: string) => {
    try {
      const payload: PairingPayload = JSON.parse(qrString);
      if (!payload.serverUrl || !payload.token) {
        throw new Error("Invalid NudgePath pairing QR code");
      }

      // Verify connection
      const verifiedUser = await api.verifyToken(payload.serverUrl, payload.token);

      api.configure({ baseUrl: payload.serverUrl, token: payload.token });

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.SERVER_URL, payload.serverUrl),
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, payload.token),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(verifiedUser)),
      ]);

      setServerUrl(payload.serverUrl);
      setToken(payload.token);
      setUser(verifiedUser);
    } catch (err: any) {
      throw new Error(err.message || "Failed to pair with NudgePath instance");
    }
  };

  const login = async (url: string, email: string, pwd: string) => {
    const { token: newToken, user: newUser } = await api.login(url, email, pwd);

    api.configure({ baseUrl: url, token: newToken });

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.SERVER_URL, url),
      AsyncStorage.setItem(STORAGE_KEYS.TOKEN, newToken),
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser)),
    ]);

    setServerUrl(url);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    api.configure({ baseUrl: "", token: null });
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.SERVER_URL),
      AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER),
    ]);
    setServerUrl(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token && !!serverUrl,
        isLoading,
        user,
        serverUrl,
        token,
        pairWithQr,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
