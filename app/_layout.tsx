// app/_layout.tsx
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { MyThemeProvider } from "../components/theme/MyThemeProvider";
import { MyLanguageProvider } from "../components/langue/MyLanguageProvider";
import { MyUserProvider } from "../components/user/MyUserProvider";

import "../global.css";

// Garde le splash visible un peu
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // On cache le splash après 1 seconde, même si pas chargé
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
  }, []);

  // FORCE L'AFFICHAGE DES TABS (temporaire pour débloquer)
  return (
    <SafeAreaProvider>
      <MyThemeProvider>
        <MyLanguageProvider>
          <MyUserProvider>
            <Slot />
          </MyUserProvider>
        </MyLanguageProvider>
      </MyThemeProvider>
    </SafeAreaProvider>
  );
}

/*
import { Slot, Redirect } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { MyThemeProvider } from "../components/theme/MyThemeProvider";
import { MyLanguageProvider } from "../components/langue/MyLanguageProvider";
import { MyUserProvider, useUser } from "../components/user/MyUserProvider"; // ← suppose que tu as un hook useUser

import "../global.css";

// Empêche le splash natif de disparaître trop tôt
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { user, isLoading } = useUser(); // ← ton hook qui dit si connecté et si chargement fini

  // Une fois que le check auth est terminé → on cache le splash
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // Pendant le chargement → on montre RIEN (le splash natif reste visible)
  if (isLoading) {
    return null;
  }

  // Si pas connecté → on envoie vers le login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Si connecté → on montre toute l’app (les onglets, etc.)
  return (
    <SafeAreaProvider>
      <MyThemeProvider>
        <MyLanguageProvider>
          <MyUserProvider>
            <Slot />
          </MyUserProvider>
        </MyLanguageProvider>
      </MyThemeProvider>
    </SafeAreaProvider>
  );
}*/