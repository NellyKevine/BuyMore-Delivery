import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";
import { Toast, ToastDescription, ToastTitle, useToast } from "../ui/toast";
import { useRouter } from "expo-router";





export type User = {
  id:string,
  name: string;
  email: string;
  number: string;
  uriImage?:string;
  nbreCalcul:number;
  isLoggedIn: boolean; // Ajout pour savoir s'il est connecté
  
};

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
  addCalcul:(nbreCalcul:number) => void;
  updateUser: (user: User) => void;
  changeName: (name: string) => void;
  changeEmail: (email: string) => void;
  changeNumber: (number: string) => void;
  signup: (name: string, email: string, number: string) => void;
  login: ( number: string) => void;
  logout: () => void;
  changeUriImage : (uriImage: string) => void;
  isLoggedIn: boolean;
};

type UserProviderProps = {
  children: ReactNode;
};

//  Utilisateur par défaut (non connecté)
const defaultUser: User = {
  id:"",
  name: "",
  email: "",
  number: "",
  uriImage: "",
  nbreCalcul:0,
  isLoggedIn: false,
};

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  setUser: () => {},
  addCalcul:()=>{},
  updateUser: () => {},
  changeName: () => {},
  changeEmail: () => {},
  changeNumber: () => {},
  signup: () => {},
  login: () => {},
  logout: () => {},
  changeUriImage: ()=> {},
  isLoggedIn: false,
});

export const useUser = () => useContext(UserContext);

export function MyUserProvider({ children }: UserProviderProps) {
  const toast = useToast();
  const [user, setUserState] = useState<User>(defaultUser);
  const router = useRouter();
  const goToHome = () => {
    router.push("/");
  };

  //  Fonction pour sauvegarder dans AsyncStorage
  const saveUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData)); //  Convertir en string
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  //  Fonction pour définir un nouvel utilisateur
  const setUser = (newUser: User): void => {
    setUserState(newUser);
    saveUser(newUser);
  };

  //  Fonction pour définir un nouvel utilisateur
  const updateUser = (newUser: User): void => {
    setUserState(newUser);
    saveUser(newUser);
  };

  //  Fonction de connexion
  const signup = (name: string, email: string, number: string): void => {
    const newUser: User = {
      id:Math.random().toString(36).substring(2, 15), // Générer un ID simple
      name,
      email,
      number,
      nbreCalcul:0,
      isLoggedIn: false,
    };
    setUserState(newUser);
    saveUser(newUser);
  };

  // Fonction de login avec Toast
  const login = async (number: string): Promise<void> => {
    try {
      const savedUser = await AsyncStorage.getItem("user");
      
      if (savedUser) {
        const parsedUser: User = JSON.parse(savedUser);

        if (parsedUser.number === number) {
          const loggedUser = { ...parsedUser, isLoggedIn: true };
          setUserState(loggedUser);
          await saveUser(loggedUser);
          
          toast.show({
            placement: "top",
            render: () => (
              <Toast action="success" variant="outline">
                <ToastTitle>Connexion réussie</ToastTitle>
                <ToastDescription>Bienvenue {loggedUser.name} 👋</ToastDescription>
              </Toast>
            ),
          });
        } else {
          toast.show({
            placement: "top",
            render: () => (
              <Toast action="error" variant="outline">
                <ToastTitle>Erreur</ToastTitle>
                <ToastDescription>
                  Numéro incorrect ou utilisateur introuvable.
                </ToastDescription>
              </Toast>
            ),
          });
        }
      } else {
        toast.show({
          placement: "top",
          render: () => (
            <Toast action="error" variant="outline">
              <ToastTitle>Erreur</ToastTitle>
              <ToastDescription>
                Aucun utilisateur trouvé. Veuillez vous inscrire.
              </ToastDescription>
            </Toast>
          ),
        });
      }
    } catch (error) {
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="outline">
            <ToastTitle>Erreur</ToastTitle>
            <ToastDescription>
              Une erreur est survenue lors de la connexion.
            </ToastDescription>
          </Toast>
        ),
      });
      console.error("Erreur lors de la connexion :", error);
    }
  };

  //  Fonction de déconnexion
  const logout = (): void => {
    setUserState(defaultUser);
    saveUser(defaultUser);
  };

  //  Changer le nom uniquement
  const changeName = (name: string): void => {
    const updatedUser = { ...user, name };
    setUserState(updatedUser);
    saveUser(updatedUser);
  };

  //  Changer l'email uniquement
  const changeEmail = (email: string): void => {
    const updatedUser = { ...user, email };
    setUserState(updatedUser);
    saveUser(updatedUser);
  };

  //  Changer le numéro uniquement
  const changeNumber = (number: string): void => {
    const updatedUser = { ...user, number };
    setUserState(updatedUser);
    saveUser(updatedUser);
  };
  const changeUriImage = (uriImage: string): void => {
    const updatedUser = { ...user, uriImage };
    setUserState(updatedUser);
    saveUser(updatedUser);
  };

  const addCalcul = (nbreCalcul: number): void => {
    const updatedUser = { ...user, nbreCalcul };
    setUserState(updatedUser);
    saveUser(updatedUser);
  };

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        if (savedUser) {
          const parsedUser: User = JSON.parse(savedUser); // Parser le JSON
          setUserState(parsedUser);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        addCalcul,
        updateUser,
        changeName,
        changeEmail,
        changeNumber,
        signup,
        login,
        logout,
        changeUriImage,
        isLoggedIn: user.isLoggedIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
