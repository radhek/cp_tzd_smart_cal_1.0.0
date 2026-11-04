import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';
import { CalculationResultItem } from '../../types/calculator';
import { CountdownTimer } from './CountdownTimer';
import { Share2, Sparkles } from 'lucide-react-native';
import { analyticsService } from '../../services/analytics/AnalyticsService';

interface ResultCardProps {
  items: CalculationResultItem[];
  calculatorTitle?: string;
  calculatorId?: string;
  onShare?: () => void;
}

export function ResultCard({ items, calculatorTitle, calculatorId, onShare }: ResultCardProps) {
  const { colors, typography, radius, shadows, spacing } = useAppTheme();
  const { t, i18n } = useTranslation();

  const primaryItem = items.find(i => i.isPrimary) || items[0];
  const secondaryItems = items.filter(i => i.id !== primaryItem?.id);

  const formatValue = (item: CalculationResultItem) => {
    const num = Number(item.value);
    const safeNum = Number.isFinite(num) ? num : 0;

    if (item.type === 'currency') return `₹${safeNum.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    if (item.type === 'percentage') return `${safeNum}%`;
    if (item.type === 'date') {
      const d = item.value instanceof Date ? item.value : new Date(item.value);
      return isNaN(d.getTime()) ? '' : new Intl.DateTimeFormat(i18n.language, { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
    }
    if (item.type === 'translated_text') {
      return t(String(item.value));
    }
    if (typeof item.value === 'number') {
      return safeNum.toLocaleString(i18n.language, { maximumFractionDigits: 4 });
    }
    return String(item.value ?? '');
  };

  const handleNativeShare = async () => {
    if (onShare) {
      onShare();
      return;
    }
    try {
      const lines = items.map(item => `${t(item.labelKey)}: ${formatValue(item)}`).join('\n');
      const shareText = `${calculatorTitle ? `${calculatorTitle}\n` : ''}Calculation Result:\n\n${lines}\n\nShared via Smart Calculator`;
      await Share.share({ message: shareText });
      if (calculatorId) {
        analyticsService.trackEvent('calculation_shared', { calculator_id: calculatorId });
      }
    } catch (e) {
      console.warn('Share failed:', e);
    }
  };

  if (!primaryItem) return null;

  if (primaryItem.type === 'countdown') {
    const d = primaryItem.value instanceof Date ? primaryItem.value : new Date(primaryItem.value);
    return (
      <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.border, ...shadows.md }]}>
        <View style={styles.badgeRow}>
          <View style={[styles.sparkleBadge, { backgroundColor: `${colors.primary}20` }]}>
            <Sparkles size={14} color={colors.primaryLight} />
            <Text style={[styles.badgeText, { color: colors.primaryLight, fontFamily: typography.fontFamily.semiBold }]}>
              {t('common.countdown', 'Live Countdown')}
            </Text>
          </View>
        </View>
        <Text style={[styles.primaryLabel, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium, textAlign: 'center', marginBottom: spacing.md }]}>
          {t(primaryItem.labelKey)}
        </Text>
        <CountdownTimer targetDate={d} />
      </View>
    );
  }

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.surfaceElevated, 
          borderRadius: radius.xl,
          borderColor: colors.border,
          ...shadows.lg,
        }
      ]}
    >
      {/* Top Bar with Result Badge and Share button */}
      <View style={styles.headerRow}>
        <View style={[styles.sparkleBadge, { backgroundColor: `${colors.primary}25` }]}>
          <Sparkles size={13} color={colors.primaryLight} />
          <Text style={[styles.badgeText, { color: colors.primaryLight, fontFamily: typography.fontFamily.bold }]}>
            {t('common.result', 'CALCULATION RESULT')}
          </Text>
        </View>

        <TouchableOpacity 
          activeOpacity={0.7} 
          style={[styles.shareBtn, { backgroundColor: colors.surfaceHighlight, borderRadius: radius.sm }]} 
          onPress={handleNativeShare}
        >
          <Share2 size={15} color={colors.textSecondary} />
          <Text style={[styles.shareText, { color: colors.textSecondary, fontFamily: typography.fontFamily.semiBold }]}>
            {t('common.share', 'Share')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hero Primary Result */}
      <View style={[styles.primarySection, { backgroundColor: colors.surface, borderRadius: radius.lg, borderColor: colors.borderSubtle }]}>
        <Text 
          numberOfLines={2} 
          style={[styles.primaryLabel, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}
        >
          {t(primaryItem.labelKey)}
        </Text>
        <Text 
          numberOfLines={1} 
          adjustsFontSizeToFit 
          style={[
            styles.primaryValue, 
            { 
              color: colors.text, 
              fontFamily: typography.fontFamily.bold,
            }
          ]}
        >
          {formatValue(primaryItem)}
        </Text>
      </View>

      {/* Secondary Breakdown Rows */}
      {secondaryItems.length > 0 && (
        <View style={styles.secondarySection}>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          {secondaryItems.map((item, index) => (
            <View 
              key={item.id} 
              style={[
                styles.secondaryRow,
                index < secondaryItems.length - 1 && { borderBottomColor: colors.divider, borderBottomWidth: StyleSheet.hairlineWidth }
              ]}
            >
              <Text 
                numberOfLines={2} 
                style={[styles.secondaryLabel, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}
              >
                {t(item.labelKey)}
              </Text>
              <Text 
                numberOfLines={1} 
                style={[styles.secondaryValue, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}
              >
                {formatValue(item)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    marginVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    marginVertical: 20,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  badgeRow: {
    marginBottom: 12,
  },
  sparkleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  shareText: {
    fontSize: 12,
  },
  primarySection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  primaryLabel: {
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  primaryValue: {
    fontSize: 34,
    textAlign: 'center',
    lineHeight: 42,
  },
  secondarySection: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
  },
  secondaryLabel: {
    fontSize: 13,
    flex: 1,
    marginRight: 12,
  },
  secondaryValue: {
    fontSize: 15,
  },
});
