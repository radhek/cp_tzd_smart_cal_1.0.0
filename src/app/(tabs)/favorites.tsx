import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../theme/useAppTheme';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { getCalculator, CalculatorEntry } from '../../calculators/registry';
import { useRouter } from 'expo-router';
import { Star, ChevronRight, Compass, Bookmark } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryIcon, getCategoryColor } from '../../components/common/CategoryIcon';
import { HeaderIconBadge } from '../../components/common/HeaderIconBadge';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';

interface FavoriteCardItemProps {
  calc: CalculatorEntry;
  title: string;
  description: string;
  categoryLabel: string;
  colors: any;
  typography: any;
  radius: any;
  shadows: any;
  onPress: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const FavoriteCardItem = React.memo(function FavoriteCardItem({
  calc,
  title,
  description,
  categoryLabel,
  colors,
  typography,
  radius,
  shadows,
  onPress,
  onToggleFavorite,
}: FavoriteCardItemProps) {
  const catColor = getCategoryColor(calc.definition.category, colors);
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[
        styles.calcCard,
        { 
          backgroundColor: colors.surface, 
          borderRadius: radius.lg,
          borderColor: colors.border,
          ...shadows.sm,
        }
      ]}
      onPress={() => onPress(calc.definition.id)}
    >
      <CategoryIcon 
        category={calc.definition.category} 
        calculatorId={calc.definition.id} 
        size={46} 
        iconSize={22} 
      />

      <View style={styles.calcCardInfo}>
        <View style={styles.cardHeaderRow}>
          <Text numberOfLines={1} style={[styles.calcTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
            {title}
          </Text>
          <View style={[styles.categoryTag, { backgroundColor: `${catColor}15` }]}>
            <Text style={[styles.categoryTagText, { color: catColor, fontFamily: typography.fontFamily.semiBold }]}>
              {categoryLabel}
            </Text>
          </View>
        </View>
        <Text numberOfLines={2} style={[styles.calcDesc, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
          {description}
        </Text>
      </View>

      <TouchableOpacity 
        onPress={() => onToggleFavorite(calc.definition.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.starBtn}
      >
        <Star size={20} color={colors.warning} fill={colors.warning} />
      </TouchableOpacity>

      <ChevronRight size={18} color={colors.textDisabled} />
    </TouchableOpacity>
  );
});

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const { colors, typography, radius, shadows, isDarkMode } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const favoriteCalculators = usePreferencesStore((state) => state.favoriteCalculators);
  const toggleFavoriteCalculator = usePreferencesStore((state) => state.toggleFavoriteCalculator);

  const favoriteItems = useMemo(() => {
    return favoriteCalculators
      .map(id => getCalculator(id))
      .filter((calc): calc is CalculatorEntry => calc !== undefined);
  }, [favoriteCalculators]);

  const handleOpenCalculator = useCallback((id: string) => {
    router.push(`/calculator/${id}`);
  }, [router]);

  const handleToggle = useCallback((id: string) => {
    toggleFavoriteCalculator(id);
  }, [toggleFavoriteCalculator]);

  const renderItem = useCallback(({ item }: { item: CalculatorEntry }) => {
    return (
      <FavoriteCardItem
        calc={item}
        title={t(item.definition.titleKey)}
        description={t(item.definition.descriptionKey)}
        categoryLabel={t(`categories.${item.definition.category}`)}
        colors={colors}
        typography={typography}
        radius={radius}
        shadows={shadows}
        onPress={handleOpenCalculator}
        onToggleFavorite={handleToggle}
      />
    );
  }, [colors, typography, radius, shadows, t, handleOpenCalculator, handleToggle]);

  const keyExtractor = useCallback((item: CalculatorEntry) => item.definition.id, []);

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
          <HeaderIconBadge name="bookmark" size={42} iconSize={22} />
          <View>
            <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
              {t('common.favorites', 'Favorite Calculators')}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
              {favoriteItems.length} {t('common.savedShortcuts', 'pinned calculators for quick access')}
            </Text>
          </View>
        </View>
      </View>

      {favoriteItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.xl, ...shadows.md }]}>
            <View style={[styles.emptyIconWrap, { backgroundColor: isDarkMode ? 'rgba(0, 86, 210, 0.25)' : '#EBF4FF' }]}>
              <Bookmark size={44} color={isDarkMode ? '#5C99FF' : '#0056D2'} strokeWidth={2} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
              {t('common.noFavorites', 'No Favorite Calculators Yet')}
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
              {t('common.favoritesHint', 'Pin your most used calculators like EMI, GST, or SIP for one-tap access.')}
            </Text>
            <View style={{ width: '100%', marginTop: 8 }}>
              <PrimaryButton 
                label={t('common.browseCalculators', 'Browse Calculators')} 
                icon={<Compass size={18} color="#FFFFFF" />}
                onPress={() => router.push('/(tabs)/explore')} 
              />
            </View>
          </View>
        </View>
      ) : (
        <FlatList 
          data={favoriteItems}
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
  listScrollView: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  calcCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  calcCardInfo: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  calcTitle: {
    fontSize: 15,
    flex: 1,
  },
  categoryTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryTagText: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
  calcDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  starBtn: {
    padding: 4,
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
