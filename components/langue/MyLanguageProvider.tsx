import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import i18n, { Locale } from './i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LgContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, options?: Record<string, string | number>) => string;

};

type LgProviderProps = {
  children: ReactNode;
};


const LgContext = createContext<LgContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key: string) => key,
});

export const useLg = () => useContext(LgContext);

export function MyLanguageProvider({ children }: LgProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(i18n.locale as Locale);

  const setLocale = (newLocale: Locale): void => {
    i18n.locale = newLocale; //Met à jour le moteur de traduction
    setLocaleState(newLocale);

    // Sauvegarder le nouveau thème directement
        const saveLangue = async () => {
          await AsyncStorage.setItem('langue', newLocale);
        };
        saveLangue();
  };

  // Helper pour traduire facilement
  const t = (key: string, options?: Record<string, string | number>): string => {
    return i18n.t(key, options);
  };


  useEffect(() => {
    // Charger la donnée enregistrée au démarrage
    const loadLangue = async () => {
      try {
      const langue = await AsyncStorage.getItem('langue');
      if (langue === 'fr' || langue === 'en') {
        i18n.locale = langue; 
        setLocaleState(langue);
      }
      // Si erreur, on log et on continue avec le mode système
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadLangue();
  }, []);

  return (
    <LgContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LgContext.Provider>
  );
}