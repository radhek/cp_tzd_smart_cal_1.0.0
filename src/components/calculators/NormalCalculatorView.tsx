import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Delete, Calculator } from 'lucide-react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import { CalculatorDefinition } from '../../types/calculator';
import { useNormalCalculator } from '../../calculators/dailyLife/useNormalCalculator';
import { formatExpression } from '../../calculators/dailyLife/normalEngine';
import { useHistoryStore } from '../../store/useHistoryStore';
import { analyticsService } from '../../services/analytics/AnalyticsService';
import { adsService } from '../../services/ads/AdsService';
import { GlobalBannerAd } from '../../services/ads/GlobalBannerAd';

interface NormalCalculatorViewProps {
  definition: CalculatorDefinition;
  initialInputs?: Record<string, any>;
}

export function NormalCalculatorView({ definition, initialInputs }: NormalCalculatorViewProps) {
  const { t } = useTranslation();
  const { colors, typography, radius, shadows, isDarkMode } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const initialExpr = initialInputs?.expression ? String(initialInputs.expression) : '';
  const {
    expression,
    previewResult,
    finalResult,
    error,
    errorKey,
    isCalculated,
    inputDigit,
    inputDecimal,
    inputOperator,
    inputPercentage,
    toggleSign,
    backspace,
    clearAll,
    calculate,
  } = useNormalCalculator(initialExpr);

  const exprScrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll expression line to end when user types
  useEffect(() => {
    exprScrollViewRef.current?.scrollToEnd({ animated: true });
  }, [expression]);

  const handleEquals = useCallback(() => {
    calculate((completedExpr, resultVal) => {
      // 1. Commit to history store
      useHistoryStore.getState().addHistory(
        definition.id,
        { expression: completedExpr },
        {
          items: [
            {
              id: 'result',
              labelKey: 'calculators.dailyLife.normal.result',
              value: resultVal,
              type: 'number',
              isPrimary: true,
            },
          ],
        }
      );

      // 2. Track analytics
      analyticsService.trackEvent('calculation_completed', {
        calculator_id: definition.id,
        category: definition.category,
      });

      // 3. Notify AdMob interstitial engine
      adsService.onCalculationCompleted();
    });
  }, [calculate, definition.id, definition.category]);

  // Determine main display text and styling
  let mainDisplayText = '0';
  let mainDisplayColor = colors.text;
  let isPreview = false;

  if (error) {
    mainDisplayText = errorKey ? t(errorKey, error) : error;
    mainDisplayColor = colors.error;
  } else if (finalResult !== null) {
    mainDisplayText = finalResult;
    mainDisplayColor = colors.primaryLight;
  } else if (previewResult !== null) {
    mainDisplayText = `= ${previewResult}`;
    mainDisplayColor = colors.textSecondary;
    isPreview = true;
  } else if (expression) {
    // Show current token / expression formatted
    const match = expression.match(/([0-9.]+|\(-?[0-9.]+\))$/);
    mainDisplayText = match ? formatExpression(match[1]) : formatExpression(expression);
  }

  // Calculate dynamic font size based on text length to prevent overflow
  const getFontSize = (text: string) => {
    const len = text.length;
    if (len > 16) return 24;
    if (len > 12) return 28;
    if (len > 9) return 32;
    return 38;
  };

  const isSmallScreen = windowHeight < 700;
  const buttonHeight = isSmallScreen ? 48 : 54;

  // Keypad row configuration:
  // Row 1: AC, +/-, %, ÷
  // Row 2: 7, 8, 9, ×
  // Row 3: 4, 5, 6, −
  // Row 4: 1, 2, 3, +
  // Row 5: 0, ., ⌫, =
  const keypadRows = [
    [
      { label: 'AC', type: 'clear', onPress: clearAll },
      { label: '+/−', type: 'function', onPress: toggleSign },
      { label: '%', type: 'function', onPress: inputPercentage },
      { label: '÷', type: 'operator', onPress: () => inputOperator('÷') },
    ],
    [
      { label: '7', type: 'number', onPress: () => inputDigit('7') },
      { label: '8', type: 'number', onPress: () => inputDigit('8') },
      { label: '9', type: 'number', onPress: () => inputDigit('9') },
      { label: '×', type: 'operator', onPress: () => inputOperator('×') },
    ],
    [
      { label: '4', type: 'number', onPress: () => inputDigit('4') },
      { label: '5', type: 'number', onPress: () => inputDigit('5') },
      { label: '6', type: 'number', onPress: () => inputDigit('6') },
      { label: '−', type: 'operator', onPress: () => inputOperator('−') },
    ],
    [
      { label: '1', type: 'number', onPress: () => inputDigit('1') },
      { label: '2', type: 'number', onPress: () => inputDigit('2') },
      { label: '3', type: 'number', onPress: () => inputDigit('3') },
      { label: '+', type: 'operator', onPress: () => inputOperator('+') },
    ],
    [
      { label: '0', type: 'number', onPress: () => inputDigit('0') },
      { label: '.', type: 'number', onPress: inputDecimal },
      { label: 'backspace', type: 'backspace', onPress: backspace },
      { label: '=', type: 'equals', onPress: handleEquals },
    ],
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Category Badge */}
      <View style={styles.topBar}>
        <View style={[styles.badge, { backgroundColor: `${colors.categoryDailyLife}15` }]}>
          <Calculator size={14} color={colors.categoryDailyLife} style={{ marginRight: 6 }} />
          <Text style={[styles.badgeText, { color: colors.categoryDailyLife, fontFamily: typography.fontFamily.semiBold }]}>
            {t(definition.titleKey)}
          </Text>
        </View>
      </View>

      {/* Calculator Display Screen */}
      <View
        style={[
          styles.displayCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radius.xl,
            ...shadows.sm,
          },
        ]}
      >
        {/* Upper Expression Line */}
        <ScrollView
          ref={exprScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.expressionScroll}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.expressionText,
              {
                color: colors.textSecondary,
                fontFamily: typography.fontFamily.medium,
              },
            ]}
          >
            {formatExpression(expression) || ' '}
            {isCalculated ? ' =' : ''}
          </Text>
        </ScrollView>

        {/* Primary Result / Input Line */}
        <View style={styles.mainDisplayRow}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.65}
            style={[
              styles.mainDisplayText,
              {
                color: mainDisplayColor,
                fontFamily: isPreview ? typography.fontFamily.semiBold : typography.fontFamily.bold,
                fontSize: getFontSize(mainDisplayText),
              },
            ]}
          >
            {mainDisplayText}
          </Text>
        </View>
      </View>

      {/* Anchored Banner Ad Placement */}
      <View style={styles.adContainer}>
        <GlobalBannerAd placement="calculator" />
      </View>

      {/* 4-Column Keypad */}
      <View
        style={[
          styles.keypadContainer,
          {
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        {keypadRows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.keypadRow}>
            {row.map((btn, colIndex) => {
              // Custom styles depending on button type
              let btnBg = colors.surface;
              let btnBorder = colors.border;
              let textColor = colors.text;
              let fontSize = 24;
              let isEquals = btn.type === 'equals';

              if (btn.type === 'clear') {
                btnBg = colors.surfaceHighlight;
                btnBorder = colors.borderSubtle;
                textColor = colors.error;
                fontSize = 20;
              } else if (btn.type === 'function') {
                btnBg = colors.surfaceHighlight;
                btnBorder = colors.borderSubtle;
                textColor = colors.primaryLight;
                fontSize = 20;
              } else if (btn.type === 'operator') {
                btnBg = isDarkMode ? '#1E293B' : '#EBF3FC';
                btnBorder = `${colors.primaryLight}30`;
                textColor = colors.primaryLight;
                fontSize = 26;
              } else if (isEquals) {
                btnBg = colors.primary;
                btnBorder = colors.primary;
                textColor = '#FFFFFF';
                fontSize = 28;
              } else if (btn.type === 'backspace') {
                btnBg = colors.surfaceHighlight;
                btnBorder = colors.borderSubtle;
              }

              return (
                <Pressable
                  key={`btn-${rowIndex}-${colIndex}`}
                  style={({ pressed }) => [
                    styles.button,
                    {
                      backgroundColor: btnBg,
                      borderColor: btnBorder,
                      borderRadius: radius.lg,
                      height: buttonHeight,
                      ...shadows.sm,
                    },
                    isEquals && styles.equalsButtonShadow,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={btn.onPress}
                  android_ripple={{
                    color: isEquals ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 86, 210, 0.12)',
                    borderless: false,
                  }}
                >
                  {btn.type === 'backspace' ? (
                    <Delete size={22} color={colors.textSecondary} />
                  ) : (
                    <Text
                      style={[
                        styles.buttonText,
                        {
                          color: textColor,
                          fontSize,
                          fontFamily: isEquals ? typography.fontFamily.bold : typography.fontFamily.semiBold,
                        },
                      ]}
                    >
                      {btn.label}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    letterSpacing: 0.3,
  },
  displayCard: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 6,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    minHeight: 110,
    maxHeight: 160,
    justifyContent: 'flex-end',
  },
  expressionScroll: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  expressionText: {
    fontSize: 19,
    textAlign: 'right',
    letterSpacing: 0.5,
  },
  mainDisplayRow: {
    marginTop: 4,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  mainDisplayText: {
    textAlign: 'right',
    letterSpacing: 0.5,
  },
  adContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    marginVertical: 4,
  },
  keypadContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
    gap: 10,
  },
  keypadRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.95 }],
  },
  equalsButtonShadow: {
    shadowColor: '#0056D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    textAlign: 'center',
  },
});
