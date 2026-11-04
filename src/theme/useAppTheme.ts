import { useColorScheme } from 'react-native';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { lightTheme, darkTheme, typography, spacing, radius, shadows } from './index';

export const useAppTheme = () => {
  const systemColorScheme = useColorScheme();
  const themePreference = usePreferencesStore((state) => state.theme);

  const isDarkMode = 
    themePreference === 'dark' || 
    (themePreference === 'system' && systemColorScheme === 'dark');

  const colors = isDarkMode ? darkTheme.colors : lightTheme.colors;

  return {
    isDarkMode,
    colors,
    typography,
    spacing,
    radius,
    shadows,
  };
};
