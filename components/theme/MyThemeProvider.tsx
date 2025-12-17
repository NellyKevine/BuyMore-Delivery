import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider/index";
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';
type ThemeOrNull = Theme | null;

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

type ThemeProviderProps = {
  children: ReactNode;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function MyThemeProvider({ children }: ThemeProviderProps) {
  // colorScheme peut être : 'light' | 'dark' | null | undefined
  const { colorScheme } = useColorScheme(); // mode du système
  const [manualMode, setManualMode] = useState<ThemeOrNull>(null);// ou useState<'light' | 'dark' | null>(null);

  // Déterminer si le mode est sombre
  const isDark: boolean = manualMode 
    ? manualMode === 'dark' 
    : colorScheme === 'dark';
  
  // Fonction sans retour (void)
  const toggleTheme = (): void => {
    const newTheme: Theme = isDark ? 'light' : 'dark';
    setManualMode(newTheme);
    
    // Sauvegarder le nouveau thème directement
    const saveTheme = async () => {
      await AsyncStorage.setItem('theme', newTheme);
    };
    saveTheme();
  
  };

  // ?? rejette SEULEMENT null et undefined 
  const mode: Theme = (manualMode ?? colorScheme ?? 'light') as Theme;
  //as Theme dit à TypeScript : "Arrête d'analyser, je te garantis que c'est de type Theme", Typescript ne tient pas compte de ?? il fait une union de types, ceux de manualMode et colorScheme et null et undefined ne font pas partie de Theme


  useEffect(() => {
    // Charger la donnée enregistrée au démarrage
    const loadTheme = async () => {
      try {
      const theme = await AsyncStorage.getItem('theme');
      if (theme === 'light' || theme === 'dark') {
        setManualMode(theme);
      }
      // Si erreur, on log et on continue avec le mode système
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <GluestackUIProvider mode={mode}>
        {children}
      </GluestackUIProvider>
    </ThemeContext.Provider>
  );
}
