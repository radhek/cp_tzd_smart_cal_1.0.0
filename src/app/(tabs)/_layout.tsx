import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Home, Compass, History, Star, Settings } from 'lucide-react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const { t } = useTranslation();
  const { colors, typography, isDarkMode } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDarkMode ? '#FF7A1A' : colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#0A2031' : colors.surface,
          borderTopColor: colors.borderSubtle,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 56 + insets.bottom : 64 + Math.max(insets.bottom, 6),
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          elevation: isDarkMode ? 0 : 8,
        },
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.medium,
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('common.home'),
          tabBarIcon: ({ color, size }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t('common.explore'),
          tabBarIcon: ({ color, size }) => <Compass size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('common.history'),
          tabBarIcon: ({ color, size }) => <History size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('common.favorites'),
          tabBarIcon: ({ color, size }) => <Star size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('common.settings'),
          tabBarIcon: ({ color, size }) => <Settings size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
