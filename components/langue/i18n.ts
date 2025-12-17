import { I18n } from 'i18n-js' ;
import * as Localization from 'expo-localization';
import { en, fr } from './globaleLg';


// Types supportés
export type Locale = 'en' | 'fr';

const i18n = new I18n({ en, fr });

// Configuration
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

// Détecter la langue système
const systemLang = Localization.getLocales()[0]?.languageCode;
const supportedLocales: Locale[] = ['en', 'fr'];

// Définir la locale initiale
i18n.locale = supportedLocales.includes(systemLang as Locale) 
  ? (systemLang as Locale) 
  : 'en';

export default i18n;