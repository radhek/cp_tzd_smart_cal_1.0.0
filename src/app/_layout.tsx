import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { useAppTheme } from '../theme/useAppTheme';
import { initI18n } from '../i18n';
import { useFonts, NotoSans_400Regular, NotoSans_500Medium, NotoSans_600SemiBold, NotoSans_700Bold } from '@expo-google-fonts/noto-sans';

import { adsService } from '../services/ads/AdsService';
import { analyticsService } from '../services/analytics/AnalyticsService';

export default function RootLayout() {
  const { isDarkMode, colors } = useAppTheme();
  const hasHydrated = usePreferencesStore((state) => state.hasHydrated);

  const [fontsLoaded] = useFonts({
    'NotoSans-Regular': NotoSans_400Regular,
    'NotoSans-Medium': NotoSans_500Medium,
    'NotoSans-SemiBold': NotoSans_600SemiBold,
    'NotoSans-Bold': NotoSans_700Bold,
  });

  useEffect(() => {
    if (hasHydrated) {
      initI18n();
      analyticsService.initialize().then(() => {
        analyticsService.trackEvent('app_open');
      });
      adsService.initialize();
    }
  }, [hasHydrated]);

  if (!hasHydrated || !fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontFamily: 'NotoSans-Bold',
            fontSize: 18,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="scan" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
