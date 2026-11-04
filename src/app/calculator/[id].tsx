import React, { useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { getCalculator } from '../../calculators/registry';
import { CalculatorLayout } from '../../components/calculators/CalculatorLayout';
import { NormalCalculatorView } from '../../components/calculators/NormalCalculatorView';
import { useAppTheme } from '../../theme/useAppTheme';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { Star, ChevronLeft } from 'lucide-react-native';
import { analyticsService } from '../../services/analytics/AnalyticsService';
import { adsService } from '../../services/ads/AdsService';

export default function CalculatorScreen() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const { t } = useTranslation();
  const { colors, typography, isDarkMode } = useAppTheme();
  const router = useRouter();
  const navigation = useNavigation();
  
  // Exclude 'id' to get just the initial inputs passed from history or scanner
  const { id: _id, ...initialInputs } = params;
  
  const isFavorite = usePreferencesStore(useCallback((state) => state.favoriteCalculators.includes(id), [id]));
  const toggleFavoriteCalculator = usePreferencesStore((state) => state.toggleFavoriteCalculator);
  const calculator = useMemo(() => getCalculator(id), [id]);

  // Show interstitial at a natural transition when navigating away from calculator screen (if eligible)
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      adsService.showInterstitialIfEligible();
    });

    return unsubscribe;
  }, [navigation]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    if (calculator) {
      analyticsService.trackEvent('calculator_opened', {
        calculator_id: calculator.definition.id,
        category: calculator.definition.category
      });
    }
  }, [id, calculator]);

  if (!calculator) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: t('common.error', 'Error') }} />
        <Text style={{ color: colors.error, fontFamily: typography.fontFamily.semiBold, fontSize: 16 }}>
          Calculator not found
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: t(calculator.definition.titleKey),
          headerStyle: {
            backgroundColor: isDarkMode ? '#081E2E' : colors.surface,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontFamily: typography.fontFamily.bold,
            fontSize: 17,
          },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={handleBack} 
              style={{ marginRight: 8, padding: 4 }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => {
                toggleFavoriteCalculator(calculator.definition.id);
                if (!isFavorite) {
                  analyticsService.trackEvent('calculator_favorited', {
                    calculator_id: calculator.definition.id,
                    category: calculator.definition.category
                  });
                }
              }} 
              style={{ marginRight: 4, padding: 4 }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Star 
                size={22} 
                color={isFavorite ? colors.warning : colors.textDisabled} 
                fill={isFavorite ? colors.warning : 'transparent'} 
              />
            </TouchableOpacity>
          )
        }} 
      />
      {id === 'daily-normal-calculator' ? (
        <NormalCalculatorView
          definition={calculator.definition}
          initialInputs={initialInputs}
        />
      ) : (
        <CalculatorLayout 
          definition={calculator.definition} 
          onCalculate={calculator.calculate}
          initialInputs={initialInputs}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  }
});
