import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import * as Notifications from "expo-notifications";

// === À CHANGER : ton URL réelle (pas 127.0.0.1 en production !) ===
const API_BASE_URL = "https://tp4buymore-production.up.railway.app"; // Plus tard : https://tondomaine.com

// Type utilisateur selon ta réponse /profile
export type User = {
  id: number | string;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  uriImage?: string;
};

type UserContextType = {
  user: User;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => void;
  changeUriImage: (uriImage: string) => void;
};

const defaultUser: User = { id: "", name: "", email: "" };

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  token: null,
  isLoggedIn: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  updateUser: () => {},
  changeUriImage: () => {},
});

export const useUser = () => useContext(UserContext);

type UserProviderProps = { children: ReactNode };

export function MyUserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>(defaultUser);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Axios avec token automatique
  const api = axios.create({ baseURL: API_BASE_URL , timeout: 12000, });
  api.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const saveToken = async (newToken: string) => {
    await SecureStore.setItemAsync("authToken", newToken);
    setToken(newToken);
  };

  const saveUserData = async (userData: User) => {
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
  };

  const updateUser = (updatedData: Partial<User>) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    saveUserData(updated);
  };

  const changeUriImage = (uriImage: string) => updateUser({ uriImage });

  // Récupère le profil
  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/api/livreur/profile");
      await saveUserData(response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) await logout();
      throw error;
    }
  };

  // Récupère le FCM token et le renvoie (ou vide si pas de permission)
  const getFcmToken = async (): Promise<string> => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return "";

      const pushToken = await Notifications.getExpoPushTokenAsync({
        projectId: "ton-project-id-expo", // À vérifier sur expo.dev
      });
      return pushToken.data;
    } catch {
      return "";
    }
  };

  // === CONNEXION ===
  const login = async (email: string, password: string) => {
    try {
      console.log("Hey");
      const fcmToken = await getFcmToken();
      
      const response = await axios.post(`${API_BASE_URL}/api/livreur/login`, {
        email,
        password,
        fcm_token: fcmToken,
      });

      const { token: jwtToken } = response.data;
      await saveToken(jwtToken);

      const userData = await fetchUserProfile();

      Alert.alert(
        "Connexion réussie !",
        `Bienvenue ${userData.name} 👋`,
        [{ text: "OK", onPress: () => router.replace("/") }]
      );
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        (error.response?.status === 401
          ? "Email ou mot de passe incorrect"
          : "Erreur réseau");

      Alert.alert("Échec de connexion", message, [{ text: "OK" }]);
    }
  };

  // === DÉCONNEXION ===
  const logout = async () => {
    try {
      // On appelle l'endpoint logout du serveur pour invalider le token
      await api.post("/api/livreur/logout");
    } catch (error) {
      console.log("Erreur lors du logout serveur, on continue localement");
    }

    await SecureStore.deleteItemAsync("authToken");
    await AsyncStorage.removeItem("userData");
    setUser(defaultUser);
    setToken(null);

    Alert.alert("Déconnexion", "Vous êtes déconnecté.", [
      { text: "OK", onPress: () => router.push("/(auth)/login") },
    ]);
  };

  // Chargement au démarrage
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("authToken");
        const storedUser = await AsyncStorage.getItem("userData");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Erreur chargement auth", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Si token présent mais pas d'user → on rafraîchit le profil
  useEffect(() => {
    if (token && !user.id && !isLoading) {
      fetchUserProfile().catch(() => logout());
    }
  }, [token, user.id, isLoading]);

  const isLoggedIn = !!user.id && !!token;

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        isLoading,
        login,
        logout,
        updateUser,
        changeUriImage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}