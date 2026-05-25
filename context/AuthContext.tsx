import { PRIVACY_POLICY_CONSENT_KEY } from "@/constants/params";
import {
  LoginData,
  PrivacyPolicyConsent,
  RegisterData,
} from "@/interface/AuthData";
import { User } from "@/interface/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  register: (
    data: RegisterData,
  ) => Promise<{ success: boolean; error?: string }>;
  login: (data: LoginData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (
    data: Partial<RegisterData>,
  ) => Promise<{ success: boolean; error?: string }>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  register: async () => ({ success: false }),
  login: async () => ({ success: false }),
  logout: async () => {},
  updateUser: async () => ({ success: false }),
});

interface AuthProviderProps {
  children: ReactNode;
}

// API
// const API_URL = "http://172.2.1.222:8080/api/auth";
// ipconfig getifaddr en0
//export const API_BASE_URL = "http://192.168.0.20:8080";
export const API_BASE_URL = "https://bionum-server.vercel.app";
const API_URL = `${API_BASE_URL}/api/auth`;

type StoredPrivacyConsent = PrivacyPolicyConsent & {
  email: string;
  user_id?: number | null;
};

const persistPrivacyPolicyConsent = async (
  consent: PrivacyPolicyConsent | undefined,
  email: string,
  userId?: number | null,
) => {
  if (!consent?.accepted) return;

  try {
    const raw = await AsyncStorage.getItem(PRIVACY_POLICY_CONSENT_KEY);
    const current: Record<string, StoredPrivacyConsent> = raw
      ? JSON.parse(raw)
      : {};

    current[email.toLowerCase()] = {
      ...consent,
      email,
      user_id: userId ?? null,
    };

    await AsyncStorage.setItem(
      PRIVACY_POLICY_CONSENT_KEY,
      JSON.stringify(current),
    );
  } catch (error) {
    console.warn("Failed to persist privacy policy consent", error);
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // --- Проверка токена при запуске приложения
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        console.log("Saved token:", savedToken);

        if (savedToken) {
          const res = await axios.get(`${API_URL}/verify`, {
            headers: { Authorization: `Bearer ${savedToken}` },
          });

          if (res.data.valid) {
            setUser(res.data.user);
            setToken(savedToken);
          } else {
            await AsyncStorage.removeItem("token");
          }
        }
      } catch (err) {
        console.log("Auth check failed:", (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadAuthState();
  }, []);

  // --- Регистрация
  const register = async (data: RegisterData) => {
    try {
      const { privacy_policy_consent } = data;
      const registrationPayload = {
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        date_of_birth: data.date_of_birth,
        email: data.email,
        password: data.password,
      };

      if (__DEV__) {
        console.log("[AUTH REGISTER PAYLOAD]", registrationPayload);
      }

      const res = await axios.post(`${API_URL}/register`, registrationPayload);
      console.log("Registration successful:", res.data);

      const { token, user } = res.data;
      await AsyncStorage.setItem("token", token);
      await persistPrivacyPolicyConsent(
        privacy_policy_consent,
        registrationPayload.email,
        user?.id,
      );
      setUser(user);
      setToken(token);

      return { success: true };
    } catch (err: any) {
      console.log("Register error:", err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error || "Registration failed",
      };
    }
  };

  // --- Логин
  const login = async (data: LoginData) => {
    try {
      const res = await axios.post(`${API_URL}/login`, data);
      const { token, user } = res.data;

      await AsyncStorage.setItem("token", token);
      setUser(user);
      setToken(token);

      return { success: true };
    } catch (err: any) {
      console.log("Login error:", err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    }
  };

  // --- Обновление пользователя
  const updateUser = async (data: Partial<RegisterData>) => {
    if (!token) return { success: false, error: "Not authenticated" };

    try {
      const res = await axios.patch(`${API_URL}/update`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = res.data.user;
      setUser(updatedUser);

      console.log("User updated:", updatedUser);
      return { success: true };
    } catch (err: any) {
      console.log("Update error:", err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error || "Update failed",
      };
    }
  };

  // --- Логаут
  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, register, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
