import { Slot, SplashScreen } from "expo-router";
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MyLanguageProvider } from "../components/langue/MyLanguageProvider";
import { MyThemeProvider } from "../components/theme/MyThemeProvider";
import { MyUserProvider } from "../components/user/MyUserProvider";
import "../global.css";
            

export default function RootLayout() {
  

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