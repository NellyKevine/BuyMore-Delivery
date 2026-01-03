// app/_layout.tsx
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { MyThemeProvider } from "../components/theme/MyThemeProvider";
import { MyLanguageProvider } from "../components/langue/MyLanguageProvider";
import { MyUserProvider } from "../components/user/MyUserProvider";

import "../global.css";

import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {  useSegments } from 'expo-router';

// Configuration À JOUR pour Expo SDK 54
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,     // ← La ligne qui manquait !
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Garde le splash visible un peu
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  
const segments = useSegments();

console.log("Segments actuels:", segments);

  // Nouveau : client React Query global
  const queryClient = new QueryClient();
  
  const router = useRouter(); // ← Maintenant à l'intérieur du composant → OK !

  useEffect(() => {
    // Quand l'utilisateur clique sur une notification (app fermée ou en arrière-plan)
    const subscription1 = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification cliquée !", response);

      // Redirection vers l'écran des livraisons (adapte le chemin si besoin)
      router.replace("/(tabs)");
    });

    // Quand une notification arrive pendant que l'app est ouverte
    const subscription2 = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification reçue en premier plan :", notification);

      Alert.alert(
        notification.request.content.title || "Nouvelle commande",
        notification.request.content.body || "Vous avez une nouvelle livraison !",
      );
    });

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, [router]); // dépendance router

  // Cache le splash après 0.5 seconde
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <MyThemeProvider>
          <MyLanguageProvider>
            <MyUserProvider>
              <Slot />
            </MyUserProvider>
          </MyLanguageProvider>
        </MyThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}