import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  Share, 
  KeyboardAvoidingView, 
  Platform,
  Keyboard
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../theme/useAppTheme';
import { CalculatorDefinition, CalculationResult } from '../../types/calculator';
import { validateInputs } from '../../calculators/engine';
import { NumberInput, CurrencyInput, PercentageInput, DurationInput } from '../inputs/NumberInput';
import { SegmentedInput } from '../inputs/SegmentedInput';
import { SelectInput } from '../inputs/SelectInput';
import { DateInput } from '../inputs/DateInput';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { ResultCard } from '../cards/ResultCard';
import { useHistoryStore } from '../../store/useHistoryStore';
import { adsService } from '../../services/ads/AdsService';
import { analyticsService } from '../../services/analytics/AnalyticsService';
import { GlobalBannerAd } from '../../services/ads/GlobalBannerAd';
import { CategoryIcon, getCategoryColor } from '../common/CategoryIcon';
import { ArrowLeftRight, RotateCcw, Calculator, Info } from 'lucide-react-native';

interface CalculatorLayoutProps {
  definition: CalculatorDefinition;
  onCalculate: (inputs: Record<string, any>) => CalculationResult;
  initialInputs?: Record<string, any>;
}

export function CalculatorLayout({ definition, onCalculate, initialInputs }: CalculatorLayoutProps) {
  const { t } = useTranslation();
  const { colors, typography, radius, shadows } = useAppTheme();
  
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const state: Record<string, any> = {};
    definition.fields.forEach(f => {
      if (initialInputs && initialInputs[f.id] !== undefined) {
        state[f.id] = f.type === 'date' ? new Date(initialInputs[f.id]) : initialInputs[f.id];
      } else if (f.defaultValue !== undefined) {
        state[f.id] = f.defaultValue;
      } else if (f.type === 'date') {
        state[f.id] = new Date();
      }
    });
    return state;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const lastCalculateTimeRef = useRef(0);

  const scrollViewRef = useRef<ScrollView>(null);
  const formCardLayout = useRef<{ y: number; height: number }>({ y: 0, height: 0 });
  const fieldLayouts = useRef<Record<string, { y: number; height: number }>>({});
  const activeFieldRef = useRef<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scrollToField = useCallback((fieldId: string, customKbHeight?: number) => {
    const fieldIndex = definition.fields.findIndex(f => f.id === fieldId);
    if (fieldIndex === -1) return;

    let targetY = 0;
    if (fieldIndex === 0) {
      // For the first field, scroll past the hero header so the form card starts near top.
      // This brings the active field and the subsequent fields into full view above the keyboard.
      targetY = Math.max(0, formCardLayout.current.y - 12);
    } else {
      // For subsequent fields, scroll so the focused field has headroom at top,
      // keeping subsequent fields and buttons visible below it.
      const fieldOffset = fieldLayouts.current[fieldId]?.y ?? (fieldIndex * 85);
      targetY = Math.max(0, formCardLayout.current.y + fieldOffset - 30);
    }

    scrollViewRef.current?.scrollTo({ y: targetY, animated: true });

    // Web / Mobile browser viewport handling (Visual Viewport API / DOM scroll)
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      try {
        const activeEl = document.activeElement as HTMLElement | null;
        if (activeEl && typeof activeEl.scrollIntoView === 'function') {
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch {}
    }
  }, [definition.fields]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      const height = e.endCoordinates ? e.endCoordinates.height : 280;
      setKeyboardHeight(Math.max(height, 280));
      if (activeFieldRef.current) {
        const activeId = activeFieldRef.current;
        setTimeout(() => {
          scrollToField(activeId, height);
        }, 60);
      }
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    // Mobile Web / Browser Visual Viewport handling (Chrome on Android, Realme, Redmi, etc.)
    let visualViewportCleanup: (() => void) | undefined;
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.visualViewport) {
      const handleVisualViewportChange = () => {
        if (!window.visualViewport) return;
        const currentViewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const diff = windowHeight - currentViewportHeight;

        if (diff > 100) {
          setKeyboardHeight(diff);
          if (activeFieldRef.current) {
            scrollToField(activeFieldRef.current, diff);
          }
        } else {
          setKeyboardHeight(0);
        }
      };

      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
      window.visualViewport.addEventListener('scroll', handleVisualViewportChange);

      visualViewportCleanup = () => {
        window.visualViewport?.removeEventListener('resize', handleVisualViewportChange);
        window.visualViewport?.removeEventListener('scroll', handleVisualViewportChange);
      };
    }

    return () => {
      showSub.remove();
      hideSub.remove();
      visualViewportCleanup?.();
    };
  }, [scrollToField]);

  const handleFieldFocus = (fieldId: string, index: number) => {
    activeFieldRef.current = fieldId;
    scrollToField(fieldId, keyboardHeight);
    setTimeout(() => {
      scrollToField(fieldId, keyboardHeight);
    }, 120);
    setTimeout(() => {
      scrollToField(fieldId, keyboardHeight);
    }, 280);
  };

  const handleInputChange = (id: string, value: any) => {
    setInputs(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
    // Clear result when input changes
    setResult(null);
  };

  const handleCalculate = useCallback(() => {
    const now = Date.now();
    // Prevent duplicate calculations from rapid repeated taps (400ms debounce)
    if (now - lastCalculateTimeRef.current < 400 || isCalculating) {
      return;
    }
    lastCalculateTimeRef.current = now;

    // Immediately dismiss keyboard on tap so user sees full form and results
    Keyboard.dismiss();

    const validation = validateInputs(definition, inputs);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    // Clear validation errors and lock duplicate taps
    setErrors({});
    setIsCalculating(true);

    try {
      const calcResult = onCalculate(inputs);
      setResult(calcResult);
      useHistoryStore.getState().addHistory(definition.id, inputs, calcResult);
      
      analyticsService.trackEvent('calculation_completed', {
        calculator_id: definition.id,
        category: definition.category
      });
      
      adsService.onCalculationCompleted();
    } catch (e) {
      console.warn('[Calculator] Calculation error:', e);
    } finally {
      // Re-enable after short window to prevent rapid double-clicks
      setTimeout(() => {
        setIsCalculating(false);
      }, 300);
    }
  }, [definition, inputs, onCalculate, isCalculating]);

  const handleReset = useCallback(() => {
    Keyboard.dismiss();
    const defaultState: Record<string, any> = {};
    definition.fields.forEach(f => {
      if (f.defaultValue !== undefined) {
        defaultState[f.id] = f.defaultValue;
      } else if (f.type === 'date') {
        defaultState[f.id] = new Date();
      }
    });
    setInputs(defaultState);
    setErrors({});
    setResult(null);
  }, [definition.fields]);

  const renderField = (field: CalculatorDefinition['fields'][0], index: number) => {
    const commonProps = {
      labelKey: field.labelKey,
      value: inputs[field.id] !== undefined ? String(inputs[field.id]) : '',
      onChange: (val: string) => handleInputChange(field.id, val),
      errorKey: errors[field.id],
      onFocus: () => handleFieldFocus(field.id, index),
    };

    switch (field.type) {
      case 'currency':
        return <CurrencyInput key={field.id} {...commonProps} />;
      case 'percentage':
        return <PercentageInput key={field.id} {...commonProps} />;
      case 'duration':
        return <DurationInput key={field.id} {...commonProps} />;
      case 'number':
        return <NumberInput key={field.id} {...commonProps} />;
      case 'date':
        const dateVal = inputs[field.id] instanceof Date 
          ? inputs[field.id] 
          : (inputs[field.id] ? new Date(inputs[field.id]) : new Date(0));
        return (
          <DateInput
            key={field.id}
            labelKey={field.labelKey}
            value={dateVal}
            onChange={(val) => handleInputChange(field.id, val)}
            errorKey={errors[field.id]}
          />
        );
      case 'segmented':
        return (
          <SegmentedInput 
            key={field.id} 
            {...commonProps} 
            onChange={(val) => handleInputChange(field.id, val)}
            options={field.options || []}
            value={inputs[field.id] || field.options?.[0]?.value || ''}
          />
        );
      case 'select':
        return (
          <SelectInput
            key={field.id}
            {...commonProps}
            onChange={(val) => handleInputChange(field.id, val)}
            options={field.options || []}
            value={inputs[field.id] || field.options?.[0]?.value || ''}
          />
        );
      default:
        return null;
    }
  };

  const handleShare = async () => {
    if (!result) return;
    
    try {
      const title = t(definition.titleKey);
      const itemsText = result.items.map(item => {
        let valStr = String(item.value);
        if (item.type === 'currency') valStr = `₹${Number(item.value).toLocaleString('en-IN')}`;
        if (item.type === 'percentage') valStr = `${item.value}%`;
        return `${t(item.labelKey)}: ${valStr}`;
      }).join('\n');
      
      const message = `Smart Calculator\n\n${title} Result:\n\n${itemsText}`;
      
      await Share.share({ message });
      
      analyticsService.trackEvent('calculation_shared', {
        calculator_id: definition.id,
        category: definition.category
      });
    } catch (error) {
      console.warn(error);
    }
  };

  const handleSwap = () => {
    Keyboard.dismiss();
    setInputs(prev => {
      const from = prev['from'];
      const to = prev['to'];
      if (from && to) {
        return { ...prev, from: to, to: from };
      }
      return prev;
    });
    setResult(null);
  };

  const categoryColor = getCategoryColor(definition.category, colors);

  return (
    <KeyboardAvoidingView 
      style={[
        styles.keyboardAvoidingView,
        Platform.OS === 'web' ? ({ height: '100%', overflow: 'hidden' } as any) : undefined
      ]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={[styles.container, { backgroundColor: colors.background }]} 
        contentContainerStyle={[
          styles.contentContainer, 
          { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 40 : 36 }
        ]}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card with Category Icon, Title, and Description */}
        <View 
          style={[
            styles.heroHeader, 
            { 
              backgroundColor: colors.surface, 
              borderColor: colors.border,
              borderRadius: radius.xl,
              ...shadows.sm,
            }
          ]}
        >
          <View style={styles.heroTopRow}>
            <CategoryIcon 
              category={definition.category} 
              calculatorId={definition.id} 
              size={50} 
              iconSize={24} 
            />
            <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}18` }]}>
              <Text style={[styles.categoryBadgeText, { color: categoryColor, fontFamily: typography.fontFamily.bold }]}>
                {t(`categories.${definition.category}`)}
              </Text>
            </View>
          </View>

          <Text style={[styles.heroTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
            {t(definition.titleKey)}
          </Text>
          <Text style={[styles.heroDescription, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
            {t(definition.descriptionKey)}
          </Text>
        </View>

        {/* Inputs Form Card */}
        <View 
          onLayout={(e) => {
            formCardLayout.current = {
              y: e.nativeEvent.layout.y,
              height: e.nativeEvent.layout.height,
            };
          }}
          style={[
            styles.formCard, 
            { 
              backgroundColor: colors.surface, 
              borderColor: colors.border,
              borderRadius: radius.xl,
              ...shadows.sm,
            }
          ]}
        >
          <Text style={[styles.formHeading, { color: colors.textSecondary, fontFamily: typography.fontFamily.semiBold }]}>
            {t('common.parameters', 'ENTER DETAILS')}
          </Text>

          {definition.fields.map((field, index) => (
            <View
              key={field.id}
              onLayout={(e) => {
                fieldLayouts.current[field.id] = {
                  y: e.nativeEvent.layout.y,
                  height: e.nativeEvent.layout.height,
                };
              }}
            >
              {renderField(field, index)}
            </View>
          ))}

          {definition.allowSwap && (
            <View style={styles.swapBtnWrap}>
              <PrimaryButton 
                variant="secondary" 
                label={t('calculators.converters.swap', 'Swap Units')} 
                icon={<ArrowLeftRight size={16} color={colors.text} />}
                onPress={handleSwap} 
              />
            </View>
          )}

          {/* Primary Action Button (Gradient) */}
          <View style={styles.actionBtnWrap}>
            <PrimaryButton 
              label={t('common.calculate', 'Calculate')} 
              icon={<Calculator size={18} color="#FFFFFF" />}
              onPress={handleCalculate} 
              isLoading={isCalculating}
              size="lg"
            />
          </View>

          {/* Secondary Reset Action */}
          <View style={styles.resetWrap}>
            <PrimaryButton 
              variant="outline" 
              label={t('common.reset', 'Reset Values')} 
              icon={<RotateCcw size={16} color={colors.textSecondary} />}
              onPress={handleReset} 
              size="sm"
            />
          </View>
        </View>

        {/* Disclaimer Callout if available */}
        {definition.disclaimerKey && (
          <View 
            style={[
              styles.disclaimerBox, 
              { 
                backgroundColor: colors.surfaceHighlight, 
                borderRadius: radius.lg, 
                borderColor: colors.borderSubtle 
              }
            ]}
          >
            <Info size={16} color={colors.textSecondary} style={{ marginRight: 8, marginTop: 1 }} />
            <Text style={[styles.disclaimerText, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
              {t(definition.disclaimerKey)}
            </Text>
          </View>
        )}

        {/* Result UI */}
        {result && (
          <ResultCard 
            items={result.items} 
            calculatorTitle={t(definition.titleKey)}
            calculatorId={definition.id}
            onShare={handleShare}
          />
        )}

        {/* Production AdMob Banner Placement */}
        <View style={styles.adWrapper}>
          <GlobalBannerAd />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    ...(Platform.OS === 'web' ? {
      overflowY: 'auto' as any,
      height: '100%' as any,
      WebkitOverflowScrolling: 'touch' as any,
    } : {}),
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexGrow: 1,
  },
  heroHeader: {
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    letterSpacing: 0.6,
  },
  heroTitle: {
    fontSize: 22,
    marginBottom: 6,
  },
  heroDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  formCard: {
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  formHeading: {
    fontSize: 11,
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  swapBtnWrap: {
    marginVertical: 4,
  },
  actionBtnWrap: {
    marginTop: 12,
  },
  resetWrap: {
    marginTop: 10,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  adWrapper: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
