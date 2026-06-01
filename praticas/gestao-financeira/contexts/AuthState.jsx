import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

export const AuthContext = createContext();

const STORAGE_KEY = "@gestao-financeira:auth";

export default function AuthState({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setToken(parsed.token ?? null);
          setUser(parsed.user ?? null);
        }
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  useEffect(() => {
    api.setToken(token);
  }, [token]);

  const login = useCallback(async ({ email, password }) => {
    const result = await api.login({ email, password });
    setToken(result.token);
    setUser(result.user);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    return result;
  }, []);

  const logout = useCallback(async () => {
    setToken(null);
    setUser(null);
    api.setToken(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ token, user, booting, login, logout, isAuthenticated: !!token }),
    [token, user, booting, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

