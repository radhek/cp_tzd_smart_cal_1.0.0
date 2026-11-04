import React, { useState, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable,
  TouchableOpacity, 
  TextInput,
  FlatList,
  Platform
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../theme/useAppTheme';
import { getAllCalculators, CalculatorEntry } from '../../calculators/registry';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Search, X, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryIcon, getCategoryColor } from '../../components/common/CategoryIcon';
import { HeaderIconBadge } from '../../components/common/HeaderIconBadge';
import { CalculatorCategory } from '../../types/calculator';
import { GlobalBannerAd } from '../../services/ads/GlobalBannerAd';

interface CalculatorCardItemProps {
  calc: CalculatorEntry;
  colors: any;
  typography: any;
  radius: any;
  shadows: any;
  title: string;
  description: string;
  categoryLabel: string;
  onPress: () => void;
}

const CalculatorCardItem = React.memo(function CalculatorCardItem({
  calc,
  colors,
  typography,
  radius,
  shadows,
  title,
  description,
  categoryLabel,
  onPress,
}: CalculatorCardItemProps) {
  const catColor = getCategoryColor(calc.definition.category, colors);
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[
        styles.calcCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.lg,
          ...shadows.sm,
        }
      ]}
      onPress={onPress}
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

      <ChevronRight size={18} color={colors.textDisabled} />
    </TouchableOpacity>
  );
});

const CATEGORIES: { id: 'all' | CalculatorCategory; labelKey: string }[] = [
  { id: 'all', labelKey: 'common.all' },
  { id: 'finance', labelKey: 'categories.finance' },
  { id: 'business', labelKey: 'categories.business' },
  { id: 'dailyLife', labelKey: 'categories.dailyLife' },
  { id: 'dateTime', labelKey: 'categories.dateTime' },
  { id: 'health', labelKey: 'categories.health' },
  { id: 'converters', labelKey: 'categories.converters' },
];

export default function ExploreScreen() {
  const { t } = useTranslation();
  const { colors, typography, radius, shadows, isDarkMode } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category?: string }>();

  const [userSelectedCategory, setUserSelectedCategory] = useState<'all' | CalculatorCategory | null>(null);
  const [prevParamCategory, setPrevParamCategory] = useState(params.category);
  const [searchQuery, setSearchQuery] = useState('');

  // If the route param changes via navigation, reset user override so the new route param takes effect
  if (params.category !== prevParamCategory) {
    setPrevParamCategory(params.category);
    setUserSelectedCategory(null);
  }

  const activeCategory: 'all' | CalculatorCategory = 
    userSelectedCategory !== null
      ? userSelectedCategory
      : (params.category && typeof params.category === 'string')
      ? (params.category as CalculatorCategory)
      : 'all';

  const allCalculators = getAllCalculators();

  const filteredCalculators = useMemo(() => {
    return allCalculators.filter(calc => {
      // Category filter
      if (activeCategory !== 'all' && calc.definition.category !== activeCategory) {
        return false;
      }
      // Search query filter (multilingual in en, hi, gu)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const title = t(calc.definition.titleKey).toLowerCase();
        const desc = t(calc.definition.descriptionKey).toLowerCase();
        const id = calc.definition.id.toLowerCase();
        return title.includes(query) || desc.includes(query) || id.includes(query);
      }
      return true;
    });
  }, [allCalculators, activeCategory, searchQuery, t]);

  const handleCardPress = useCallback((calcId: string) => {
    router.push(`/calculator/${calcId}`);
  }, [router]);

  const renderItem = useCallback(({ item }: { item: CalculatorEntry }) => {
    return (
      <CalculatorCardItem
        calc={item}
        colors={colors}
        typography={typography}
        radius={radius}
        shadows={shadows}
        title={t(item.definition.titleKey)}
        description={t(item.definition.descriptionKey)}
        categoryLabel={t(`categories.${item.definition.category}`)}
        onPress={() => handleCardPress(item.definition.id)}
      />
    );
  }, [colors, typography, radius, shadows, t, handleCardPress]);

  const keyExtractor = useCallback((item: CalculatorEntry) => item.definition.id, []);

  const listHeader = useMemo(() => (
    <View>
      {/* Explore Banner Ad */}
      <GlobalBannerAd placement="explore" style={{ marginVertical: 8 }} />

      <View style={styles.resultsInfoRow}>
        <Text style={[styles.resultsCount, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
          {filteredCalculators.length} {t('common.calculatorsFound', 'calculators')}
        </Text>
      </View>
    </View>
  ), [colors.textSecondary, typography.fontFamily.medium, filteredCalculators.length, t]);

  const listEmpty = useMemo(() => (
    <View style={[styles.emptyContainer, { backgroundColor: colors.surface, borderRadius: radius.xl, borderColor: colors.border }]}>
      <Search size={36} color={colors.textDisabled} />
      <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
        {t('common.noResultsFound', 'No calculators found')}
      </Text>
      <Text style={[styles.emptyDesc, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
        {t('common.tryDifferentKeywords', 'Try searching with different keywords or switch category.')}
      </Text>
    </View>
  ), [colors.surface, colors.border, colors.textDisabled, colors.text, colors.textSecondary, radius.xl, typography.fontFamily, t]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Search and Title */}
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
          <HeaderIconBadge name="compass" size={42} iconSize={22} />
          <View>
            <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
              {t('common.explore', 'Explore Calculators')}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
              {allCalculators.length} {t('common.toolsAvailable', 'financial & utility tools')}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View 
          style={[
            styles.searchBox, 
            { 
              backgroundColor: colors.inputBackground, 
              borderColor: searchQuery ? colors.primaryLight : colors.border,
              borderRadius: radius.md,
            }
          ]}
        >
          <Search size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: colors.text, fontFamily: typography.fontFamily.medium }]}
            placeholder={t('common.search', 'Search calculators... (EMI, GST, SIP)')}
            placeholderTextColor={colors.textDisabled}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter Horizontal Scroll */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map(cat => {
            const isSelected = activeCategory === cat.id;

            return (
              <Pressable
                key={cat.id}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                unstable_pressDelay={0}
                onPress={() => setUserSelectedCategory(cat.id)}
                style={({ pressed }) => [
                  styles.categoryPill,
                  {
                    backgroundColor: isSelected 
                      ? '#0056D2' 
                      : pressed 
                      ? (isDarkMode ? '#183D5C' : '#E2EBF6') 
                      : (isDarkMode ? '#102B40' : '#F1F5F9'),
                    borderColor: isSelected 
                      ? '#0048B3' 
                      : pressed 
                      ? (isDarkMode ? '#2B5D88' : '#CBD5E1') 
                      : (isDarkMode ? '#1E476D' : '#E2E8F0'),
                    borderRadius: radius.pill,
                    opacity: pressed ? 0.9 : 1.0,
                    transform: [{ scale: pressed ? 0.96 : 1.0 }],
                  },
                  isSelected && {
                    shadowColor: '#0056D2',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDarkMode ? 0.45 : 0.25,
                    shadowRadius: 4,
                    elevation: 3,
                  },
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.categoryPillText,
                    {
                      color: isSelected ? '#FFFFFF' : (isDarkMode ? '#E2E8F0' : '#1E293B'),
                      fontFamily: isSelected ? typography.fontFamily.bold : typography.fontFamily.semiBold,
                    }
                  ]}
                >
                  {cat.id === 'all' ? t('common.all', 'All') : t(cat.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Calculator Cards List */}
      <FlatList
        data={filteredCalculators}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        style={styles.listScrollView}
        contentContainerStyle={[styles.listContent, { paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
  },
  categoriesScroll: {
    gap: 8,
    paddingRight: 16,
    paddingVertical: 4,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 38,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryPillText: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  listScrollView: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  resultsInfoRow: {
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  resultsCount: {
    fontSize: 12,
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
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: 'center',
  },
});
