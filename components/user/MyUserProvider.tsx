import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useToast, Toast, ToastTitle, ToastDescription } from "../ui/toast";
import { useRouter } from "expo-router";

// Type utilisateur
export type User = {
  id: string;
  name: string;
  email: string;
  number: string;
  uriImage?: string;
  statut:string;
};

type UserContextType = {
  user: User;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (number: string) => Promise<void>;
  signup: (name: string, email: string, number: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => void;
  changeUriImage: (uriImage: string) => void;
};

const defaultUser: User = {
  id: "",
  name: "",
  email: "",
  number: "",
  uriImage: "",
  statut: "",
};

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  token: null,
  isLoggedIn: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateUser: () => {},
  changeUriImage: () => {},
});

export const useUser = () => useContext(UserContext);

type UserProviderProps = {
  children: ReactNode;
};

// === UTILISATEUR FAKE POUR LES TESTS ===
const fakeUser: User = {
  id: "1",
  name: "Ahmed Livreurs",
  email: "ahmed@exemple.com",
  number: "0601020304",
  uriImage: undefined,
  statut:"Disponible",
};
const fakeToken = "fake-jwt-token-pour-dev";

export function MyUserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>(defaultUser);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

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

  const changeUriImage = (uriImage: string) => {
    updateUser({ uriImage });
  };

  // === FONCTION FAKE LOGIN (appelée depuis login ou signup) ===
  const fakeDevLogin = async (nameForToast: string = "Livreur") => {
    await saveToken(fakeToken);
    await saveUserData(fakeUser);

    toast.show({
      placement: "top",
      render: () => (
        <Toast action="success" variant="solid">
          <ToastTitle>Connexion réussie (mode dev)</ToastTitle>
          <ToastDescription>Bienvenue {nameForToast} ! 🚀</ToastDescription>
        </Toast>
      ),
    });

    router.replace("/"); // replace pour éviter de revenir en arrière sur login
  };

  // Login : pour l’instant fake, à remplacer plus tard par axios
  const login = async (number: string) => {
    console.log("Tentative de connexion avec :", number);
    // Simulation petite attente
    await new Promise(resolve => setTimeout(resolve, 800));
    await fakeDevLogin("Ahmed");
  };

  // Signup : pour l’instant fake aussi
  const signup = async (name: string, email: string, number: string) => {
    console.log("Inscription :", name, number);
    await new Promise(resolve => setTimeout(resolve, 800));
    // On utilise le nom saisi pour le toast
    await fakeDevLogin(name || "Nouveau livreur");
  };

  // Déconnexion réelle
  const logout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    await AsyncStorage.removeItem("userData");
    setUser(defaultUser);
    setToken(null);
    router.push("/(auth)/login");
  };

  // Chargement au démarrage : uniquement ce qui est en mémoire
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("authToken");
        const storedUser = await AsyncStorage.getItem("userData");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
        // PAS de fake login automatique ici → on veut voir les pages auth !
      } catch (error) {
        console.error("Erreur chargement auth :", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const isLoggedIn = !!user.id && !!token;

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
        changeUriImage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

/*
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useToast, Toast, ToastTitle, ToastDescription } from "../ui/toast";
import axios from "axios"; // À installer : npx expo install axios
import { useRouter } from "expo-router";

// Type de l'utilisateur renvoyé par Laravel
export type User = {
  id: string;
  name: string;
  email: string;
  number: string;
  uriImage?: string;
};

// Type du contexte
type UserContextType = {
  user: User ;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (number: string, password: string) => Promise<void>;
  signup: (name: string, email: string, number: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => void;
  changeUriImage: (uriImage: string) => void;
};

//  Utilisateur par défaut (non connecté)
const defaultUser: User = {
  id:"",
  name: "",
  email: "",
  number: "",
  uriImage: "",
};

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  token: null,
  isLoggedIn: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateUser: () => {},
  changeUriImage: () => {},
});

export const useUser = () => useContext(UserContext);

type UserProviderProps = {
  children: ReactNode;
};

export function MyUserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>(defaultUser);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);//Important pour le splash screen
  const toast = useToast();
  const router = useRouter();

  // Sauvegarde sécurisée du token
  const saveToken = async (newToken: string) => {
    await SecureStore.setItemAsync("authToken", newToken);
    setToken(newToken);
  };

  // Sauvegarde des infos utilisateur (moins sensible)
  const saveUserData = async (userData: User) => {
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
  };

  // Mise à jour partielle du profil
  const updateUser = (updatedData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    saveUserData(updatedUser);
  };

  const changeUriImage = (uriImage: string) => {
    updateUser({ uriImage });
  };

  // Connexion avec Laravel
  const login = async (number: string, password: string) => {
    try {
      const response = await axios.post("https://ton-api-laravel.com/api/livreur/login", {
        number,
        password,
      });

      const { token: jwtToken, user: userData } = response.data; // Laravel renvoie généralement ça

      await saveToken(jwtToken);
      await saveUserData(userData);

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="success" variant="outline">
            <ToastTitle>Connexion réussie !</ToastTitle>
            <ToastDescription>Bienvenue {userData.name} 👋</ToastDescription>
          </Toast>
        ),
      });

      router.push("/"); // Vers les tabs
    } catch (error: any) {
      let message = "Erreur inconnue";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="outline">
            <ToastTitle>Échec de connexion</ToastTitle>
            <ToastDescription>{message}</ToastDescription>
          </Toast>
        ),
      });
    }
  };

  // Inscription (si ton API le permet)
  const signup = async (name: string, email: string, number: string, password: string) => {
    try {
      const response = await axios.post("https://ton-api-laravel.com/api/livreur/register", {
        name,
        email,
        number,
        password,
      });

      const { token: jwtToken, user: userData } = response.data;

      await saveToken(jwtToken);
      await saveUserData(userData);

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="success" variant="outline">
            <ToastTitle>Inscription réussie !</ToastTitle>
            <ToastDescription>Bienvenue {name} !</ToastDescription>
          </Toast>
        ),
      });

      router.push("/");
    } catch (error: any) {
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="outline">
            <ToastTitle>Erreur inscription</ToastTitle>
            <ToastDescription>{error.response?.data?.message || "Erreur réseau"}</ToastDescription>
          </Toast>
        ),
      });
    }
  };

  // Déconnexion
  const logout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    await AsyncStorage.removeItem("userData");
    setUser(defaultUser);
    setToken(null);
    router.push("/(auth)/login");
  };

  // Chargement au démarrage de l'app
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("authToken");
        const storedUser = await AsyncStorage.getItem("userData");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Erreur chargement auth :", error);
      } finally {
        setIsLoading(false); // Très important pour cacher le splash
      }
    };

    loadStoredData();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!user && !!token,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
        changeUriImage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}*/