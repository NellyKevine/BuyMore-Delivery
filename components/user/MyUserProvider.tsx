import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import * as Notifications from "expo-notifications";

const API_BASE_URL = "https://tp4buymore-production.up.railway.app";

// Type utilisateur selon la réponse de l'API /api/livreur/login
export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
  role: string;
  first_name: string;
  last_name: string;
  phone: string;
  fcm_token: string | null;
  cart: any | null;
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

const defaultUser: User = { 
  id: -1, 
  name: "", 
  email: "", 
  email_verified_at: null,
  is_active: 0,
  created_at: "",
  updated_at: "",
  role: "",
  first_name: "",
  last_name: "",
  phone: "",
  fcm_token: null,
  cart: null
};

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

  // Créez deux instances axios
  const api = axios.create({ baseURL: API_BASE_URL, timeout: 20000 });
  const apiNoAuth = axios.create({ baseURL: API_BASE_URL, timeout: 20000 });

  // Intercepteur pour ajouter le token aux requêtes authentifiées
  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const saveToken = async (newToken: string) => {
    console.log("Sauvegarde token:", newToken?.substring(0, 20) + "...");
    
    if (typeof newToken !== 'string') {
      console.error("ERREUR: Token n'est pas une string!", newToken);
      newToken = String(newToken);
    }
    
    await SecureStore.setItemAsync("authToken", newToken);
    setToken(newToken);
    // Mettez à jour l'instance axios
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const saveUserData = async (userData: User) => {
    console.log("Sauvegarde user:", userData.name, userData.email);
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
  };

  const updateUser = (updatedData: Partial<User>) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    saveUserData(updated);
  };

  const changeUriImage = (uriImage: string) => updateUser({ uriImage });

  // Récupère le profil - CORRIGÉ
  const fetchUserProfile = async (): Promise<User> => {
    try {
      console.log("Fetching user profile...");
      const response = await api.get("/api/livreur/profile");
      console.log("Profile response structure:", Object.keys(response.data));
      
      // La réponse a la structure {success, data, message, status}
      // Nous devons extraire response.data.data
      if (response.data.data) {
        console.log("User data from profile:", response.data.data);
        await saveUserData(response.data.data);
        return response.data.data;
      } else {
        // Fallback: si la structure est différente
        console.log("Structure différente, using response.data:", response.data);
        await saveUserData(response.data);
        return response.data;
      }
    } catch (error: any) {
      console.error("Erreur fetch profile:", error.response?.data || error.message);
      if (error.response?.status === 401) await logout();
      throw error;
    }
  };

  // Récupère le FCM token
  const getFcmToken = async (): Promise<string> => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return "";

      const pushToken = await Notifications.getExpoPushTokenAsync({
        projectId: "ton-project-id-expo",
      });
      return pushToken.data;
    } catch {
      return "";
    }
  };

  // === CONNEXION ===
  const login = async (email: string, password: string) => {
    try {
      console.log("Début de la connexion...");
      const fcmToken = await getFcmToken();
      
      // Utilisez l'instance sans auth pour le login
      const response = await apiNoAuth.post("/api/livreur/login", {
        email,
        password,
        fcm_token: fcmToken,
      });

      console.log("Réponse API:", response.data);
      
      // Accédez aux données correctement
      const jwtToken = response.data.data.token;
      const userData = response.data.data.user;
      
      console.log("Token reçu:", jwtToken?.substring(0, 20) + "...");
      console.log("User reçu:", userData.name, userData.email);
      
      // Sauvegardez le token
      await saveToken(jwtToken);
      
      // Sauvegardez les données utilisateur
      await saveUserData(userData);

      Alert.alert(
        "Connexion réussie !",
        `Bienvenue ${userData.name} 👋`,
        [{ 
          text: "OK", 
          onPress: () => {
            console.log("Redirection vers /");
            router.replace("/");
          }
        }]
      );
    } catch (error: any) {
      console.error("Erreur de connexion complète:", error);
      
      let message = "Erreur réseau";
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
        message = error.response.data?.message || 
                 (error.response.status === 401 ? "Email ou mot de passe incorrect" : "Erreur serveur");
      } else if (error.request) {
        console.error("No response:", error.request);
        message = "Pas de réponse du serveur";
      } else {
        console.error("Error:", error.message);
        message = error.message;
      }

      Alert.alert("Échec de connexion", message, [{ text: "OK" }]);
    }
  };

  // === DÉCONNEXION ===
  const logout = async () => {
    try {
      await api.post("/api/livreur/logout");
    } catch (error) {
      console.log("Erreur logout serveur:", error);
    }

    await SecureStore.deleteItemAsync("authToken");
    await AsyncStorage.removeItem("userData");
    setUser(defaultUser);
    setToken(null);
    // Retirez le header Authorization
    delete api.defaults.headers.common['Authorization'];

    Alert.alert("Déconnexion", "Vous êtes déconnecté.", [
      { text: "OK", onPress: () => router.push("/(auth)/login") },
    ]);
  };

  // Chargement au démarrage - CORRIGÉ
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Chargement des données utilisateur...");
        const storedToken = await SecureStore.getItemAsync("authToken");
        const storedUserJson = await AsyncStorage.getItem("userData");

        console.log("Token stocké:", storedToken?.substring(0, 20) + "...");
        console.log("User JSON stocké:", storedUserJson);

        if (storedToken && storedUserJson) {
          const storedUser = JSON.parse(storedUserJson);
          console.log("User parsé - id:", storedUser.id, "name:", storedUser.name);
          
          setToken(storedToken);
          setUser(storedUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
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
      console.log("Token présent mais user vide, fetch profile...");
      fetchUserProfile().catch((error) => {
        console.error("Erreur fetch profile on load:", error);
        logout();
      });
    }
  }, [token, user.id, isLoading]);

  //const isLoggedIn = !!user.id && !!token;
  const isLoggedIn = user.id > 0 && !!token; // Si id commence à 1

  console.log("UserProvider state - isLoggedIn:", isLoggedIn, "user.id:", user.id, "user.name:", user.name);

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