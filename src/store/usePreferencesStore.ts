import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemePreference = 'light' | 'dark' | 'system';
type LanguagePreference = 'en' | 'hi' | 'gu';

interface PreferencesState {
  theme: ThemePreference;
  language: LanguagePreference;
  favoriteCalculators: string[];
  setTheme: (theme: ThemePreference) => void;
  setLanguage: (lang: LanguagePreference) => void;
  toggleFavoriteCalculator: (id: string) => void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      favoriteCalculators: [],
      hasHydrated: false,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleFavoriteCalculator: (id) => set((state) => ({
        favoriteCalculators: state.favoriteCalculators.includes(id)
          ? state.favoriteCalculators.filter(c => c !== id)
          : [...state.favoriteCalculators, id]
      })),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'smart-calc-preferences',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
