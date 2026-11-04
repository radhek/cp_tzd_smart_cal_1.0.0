import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { usePreferencesStore } from '../store/usePreferencesStore';

import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';
import gu from './locales/gu/translation.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  gu: { translation: gu },
};

const getDeviceLanguage = () => {
  const deviceLang = Localization.getLocales()[0]?.languageCode || 'en';
  if (['en', 'hi', 'gu'].includes(deviceLang)) {
    return deviceLang;
  }
  return 'en';
};

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default, will be overridden by store
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// We need a way to initialize language from the persisted store when the app loads
export const initI18n = () => {
  const storeLanguage = usePreferencesStore.getState().language;
  
  if (storeLanguage) {
    i18next.changeLanguage(storeLanguage);
  } else {
    const defaultLang = getDeviceLanguage();
    i18next.changeLanguage(defaultLang);
    usePreferencesStore.getState().setLanguage(defaultLang as any);
  }
};

export default i18next;
