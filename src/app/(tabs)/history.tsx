import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Share, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Trash2, Star, ChevronRight, Share2, History, Calculator } from 'lucide-react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import { useHistoryStore, HistoryItem } from '../../store/useHistoryStore';
import { getCalculator } from '../../calculators/registry';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryIcon } from '../../components/common/CategoryIcon';
import { HeaderIconBadge } from '../../components/common/HeaderIconBadge';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';

interface HistoryCardItemProps {
  item: HistoryItem;
  title: string;
  category: string;
  calculatorId: string;
  primaryResultLabel: string;
  formattedPrimaryValue: string;
  formattedTimestamp: string;
  reopenText: string;
  colors: any;
  typography: any;
  radius: any;
  shadows: any;
  onToggleFavorite: (id: string) => void;
  onShare: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onReopen: (item: HistoryItem) => void;
}

const HistoryCardItem = React.memo(function HistoryCardItem({
  item,
  title,
  category,
  calculatorId,
  primaryResultLabel,
  formattedPrimaryValue,
  formattedTimestamp,
  reopenText,
  colors,
  typography,
  radius,
  shadows,
  onToggleFavorite,
  onShare,
  onDelete,
  onReopen,
}: HistoryCardItemProps) {
  return (
    <View 
      style={[
        styles.card, 
        { 
          backgroundColor: colors.surface, 
          borderRadius: radius.xl, 
          borderColor: colors.border, 
          ...shadows.sm 
        }
      ]}
    >
      {/* Card Header */}
      <View style={[styles.cardHeader, { borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.cardHeaderLeft}>
          <CategoryIcon 
            category={category} 
            calculatorId={calculatorId} 
            size={36} 
            iconSize={18} 
          />
          <Text style={[styles.cardTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
            {title}
          </Text>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity 
            onPress={() => onToggleFavorite(item.id)} 
            style={styles.iconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Star 
              size={18} 
              color={item.isFavorite ? colors.warning : colors.textDisabled} 
              fill={item.isFavorite ? colors.warning : 'transparent'} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => onShare(item)} 
            style={styles.iconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Share2 size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => onDelete(item.id)} 
            style={styles.iconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Trash2 size={18} color={colors.textDisabled} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Card Body - Tap to re-open and recalculate */}
      <TouchableOpacity 
        activeOpacity={0.7}
        style={styles.cardBody}
        onPress={() => onReopen(item)}
      >
        <View style={styles.resultPreview}>
          <Text style={[styles.resultLabel, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
            {primaryResultLabel}
          </Text>
          <Text style={[styles.resultValue, { color: colors.primaryLight, fontFamily: typography.fontFamily.bold }]}>
            {formattedPrimaryValue}
          </Text>
        </View>
        
        <View style={[styles.reopenBadge, { backgroundColor: colors.surfaceHighlight }]}>
          <Text style={[styles.reopenText, { color: colors.primaryLight, fontFamily: typography.fontFamily.semiBold }]}>
            {reopenText}
          </Text>
          <ChevronRight size={16} color={colors.primaryLight} />
        </View>
      </TouchableOpacity>
      
      {/* Footer with Timestamp */}
      <View style={[styles.cardFooter, { borderTopColor: colors.borderSubtle }]}>
        <Text style={[styles.timestamp, { color: colors.textDisabled, fontFamily: typography.fontFamily.regular }]}>
          {formattedTimestamp}
        </Text>
      </View>
    </View>
  );
});

export default function HistoryScreen() {
  const { t, i18n } = useTranslation();
  const { colors, typography, radius, shadows, isDarkMode } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const history = useHistoryStore((state) => state.history);
  const toggleFavorite = useHistoryStore((state) => state.toggleFavorite);
  const removeHistory = useHistoryStore((state) => state.removeHistory);
  const clearHistory = useHistoryStore((state) => state.clearHistory);

  const handleClearAll = useCallback(() => {
    Alert.alert(
      t('common.clearAll', 'Clear History'),
      t('common.clearAllConfirm', 'Are you sure you want to delete all calculation history? This action cannot be undone.'),
      [
        { text: t('common.cancel', 'Cancel'), style: 'cancel' },
        { text: t('common.delete', 'Delete All'), style: 'destructive', onPress: clearHistory }
      ]
    );
  }, [clearHistory, t]);

  const handleDeleteItem = useCallback((id: string) => {
    Alert.alert(
      t('common.deleteItem', 'Delete Entry'),
      t('common.deleteItemConfirm', 'Remove this calculation from history?'),
      [
        { text: t('common.cancel', 'Cancel'), style: 'cancel' },
        { text: t('common.delete', 'Delete'), style: 'destructive', onPress: () => removeHistory(id) }
      ]
    );
  }, [removeHistory, t]);

  const handleShareItem = useCallback(async (item: HistoryItem) => {
    const calc = getCalculator(item.calculatorId);
    if (!calc) return;
    try {
      const title = t(calc.definition.titleKey);
      const itemsText = item.result.items.map(res => {
        let valStr = String(res.value ?? '');
        const num = Number(res.value);
        const safeNum = Number.isFinite(num) ? num : 0;
        if (res.type === 'currency') valStr = `₹${safeNum.toLocaleString('en-IN')}`;
        if (res.type === 'percentage') valStr = `${safeNum}%`;
        return `${t(res.labelKey)}: ${valStr}`;
      }).join('\n');
      
      const message = `${title} Result:\n\n${itemsText}\n\nShared via Smart Calculator`;
      await Share.share({ message });
    } catch (e) {
      console.warn('Share error:', e);
    }
  }, [t]);

  const handleToggleFavorite = useCallback((id: string) => {
    toggleFavorite(id);
  }, [toggleFavorite]);

  const handleReopen = useCallback((item: HistoryItem) => {
    router.push({ pathname: `/calculator/${item.calculatorId}` as any, params: { ...item.inputs } });
  }, [router]);

  const formatValue = (item: any) => {
    const num = Number(item.value);
    const safeNum = Number.isFinite(num) ? num : 0;
    if (item.type === 'currency') return `₹${safeNum.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    if (item.type === 'percentage') return `${safeNum}%`;
    return String(item.value ?? '');
  };

  const renderItem = useCallback(({ item }: { item: HistoryItem }) => {
    const calc = getCalculator(item.calculatorId);
    if (!calc) return null;

    const primaryResult = item.result.items.find(i => i.isPrimary) || item.result.items[0];
    const formattedVal = primaryResult ? formatValue(primaryResult) : '';
    const formattedTs = new Date(item.timestamp).toLocaleString(i18n.language, { dateStyle: 'medium', timeStyle: 'short' });

    return (
      <HistoryCardItem
        item={item}
        title={t(calc.definition.titleKey)}
        category={calc.definition.category}
        calculatorId={calc.definition.id}
        primaryResultLabel={primaryResult ? t(primaryResult.labelKey) : ''}
        formattedPrimaryValue={formattedVal}
        formattedTimestamp={formattedTs}
        reopenText={t('common.reopen', 'Reopen')}
        colors={colors}
        typography={typography}
        radius={radius}
        shadows={shadows}
        onToggleFavorite={handleToggleFavorite}
        onShare={handleShareItem}
        onDelete={handleDeleteItem}
        onReopen={handleReopen}
      />
    );
  }, [colors, typography, radius, shadows, t, i18n.language, handleToggleFavorite, handleShareItem, handleDeleteItem, handleReopen]);

  const keyExtractor = useCallback((item: HistoryItem) => item.id, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View 
        style={[
          styles.headerBar, 
          { 
            paddingTop: Math.max(insets.top, 14),
            backgroundColor: isDarkMode ? '#081E2E' : colors.surface,
            borderBottomColor: colors.borderSubtle,
          }
        ]}
      >
        <View style={styles.titleRow}>
          <HeaderIconBadge name="history" size={42} iconSize={22} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
              {t('common.history', 'Calculation History')}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
              {history.length} {t('common.calculationsSaved', 'saved calculations')}
            </Text>
          </View>

          {history.length > 0 && (
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={handleClearAll}
              style={[styles.clearBtn, { backgroundColor: `${colors.error}15`, borderColor: `${colors.error}30` }]}
            >
              <Trash2 size={15} color={colors.error} />
              <Text style={[styles.clearText, { color: colors.error, fontFamily: typography.fontFamily.semiBold }]}>
                {t('common.clearAll', 'Clear')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.xl, ...shadows.md }]}>
            <View style={[styles.emptyIconWrap, { backgroundColor: isDarkMode ? 'rgba(0, 86, 210, 0.25)' : '#EBF4FF' }]}>
              <History size={44} color={isDarkMode ? '#5C99FF' : '#0056D2'} strokeWidth={2} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
              {t('common.noHistory', 'No Calculation History')}
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
              {t('common.emptyHistoryDesc', 'Calculations performed in EMI, GST, SIP or other tools will automatically appear here.')}
            </Text>
            <View style={{ width: '100%', marginTop: 8 }}>
              <PrimaryButton 
                label={t('common.startCalculating', 'Start Calculating')} 
                icon={<Calculator size={18} color="#FFFFFF" />}
                onPress={() => router.push('/(tabs)')} 
              />
            </View>
          </View>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={styles.listScrollView}
          contentContainerStyle={[styles.listContent, { paddingBottom: 40 }]}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  clearText: {
    fontSize: 12,
  },
  listScrollView: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    marginBottom: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  resultPreview: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 22,
  },
  reopenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reopenText: {
    fontSize: 12,
  },
  cardFooter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  timestamp: {
    fontSize: 11,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyCard: {
    width: '100%',
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
});
