import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable,
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../theme/useAppTheme';
import { getAllCalculators, getCalculator } from '../../calculators/registry';
import { useRouter } from 'expo-router';
import { 
  Camera, 
  Search, 
  X, 
  SlidersHorizontal, 
  ChevronRight, 
  Calculator, 
  TrendingUp, 
  Percent, 
  ArrowRight, 
  RotateCcw,
  Sparkles
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientView } from '../../components/common/GradientView';
import { CategoryIcon, getCategoryColor } from '../../components/common/CategoryIcon';
import { HeaderIconBadge } from '../../components/common/HeaderIconBadge';
import { useHistoryStore } from '../../store/useHistoryStore';
import { CalculatorCategory } from '../../types/calculator';
import { GlobalBannerAd } from '../../services/ads/GlobalBannerAd';

const QUICK_ACCESS_ITEMS = [
  { id: 'daily-normal-calculator', labelKey: 'calculators.dailyLife.normal.title', category: 'dailyLife' },
  { id: 'finance-emi', labelKey: 'calculators.emi.title', category: 'finance' },
  { id: 'business-gst', labelKey: 'calculators.gst.title', category: 'business' },
  { id: 'finance-sip', labelKey: 'calculators.sip.title', category: 'finance' },
  { id: 'finance-discount', labelKey: 'calculators.discount.title', category: 'finance' },
  { id: 'health-bmi', labelKey: 'calculators.bmi.title', category: 'health' },
  { id: 'datetime-age', labelKey: 'calculators.age.title', category: 'dateTime' },
  { id: 'converter-length', labelKey: 'calculators.converters.length', category: 'converters' },
] as const;

const CATEGORY_DEFINITIONS: { id: CalculatorCategory; titleKey: string; count: number; descKey: string }[] = [
  { id: 'finance', titleKey: 'categories.finance', count: 11, descKey: 'calculators.emi.title' },
  { id: 'business', titleKey: 'categories.business', count: 8, descKey: 'calculators.gst.title' },
  { id: 'dailyLife', titleKey: 'categories.dailyLife', count: 6, descKey: 'calculators.dailyLife.normal.title' },
  { id: 'dateTime', titleKey: 'categories.dateTime', count: 6, descKey: 'calculators.age.title' },
  { id: 'health', titleKey: 'categories.health', count: 4, descKey: 'calculators.bmi.title' },
  { id: 'converters', titleKey: 'categories.converters', count: 10, descKey: 'calculators.converters.length' },
];

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors, typography, radius, shadows, isDarkMode } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBanner, setActiveBanner] = useState<'emi' | 'gst' | 'sip'>('emi');
  
  const history = useHistoryStore((state) => state.history);
  const recentHistory = useMemo(() => history.slice(0, 3), [history]);

  const allCalculators = getAllCalculators();

  // Filtered calculators based on query (supports multilingual search in EN, HI, GU)
  const filteredCalculators = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.trim().toLowerCase();
    return allCalculators.filter(c => {
      const title = t(c.definition.titleKey).toLowerCase();
      const desc = t(c.definition.descriptionKey).toLowerCase();
      const id = c.definition.id.toLowerCase();
      return title.includes(query) || desc.includes(query) || id.includes(query);
    });
  }, [searchQuery, allCalculators, t]);

  const bannerData = {
    emi: {
      id: 'finance-emi',
      badge: 'POPULAR CHOICE',
      title: t('calculators.emi.title'),
      desc: t('calculators.emi.description'),
      cta: t('common.calculate', 'Calculate EMI'),
      icon: <Calculator size={32} color={colors.white} />,
      gradient: [colors.accentGradientStart, colors.accentGradientEnd] as [string, string],
    },
    gst: {
      id: 'business-gst',
      badge: 'BUSINESS ESSENTIAL',
      title: t('calculators.gst.title'),
      desc: t('calculators.gst.description'),
      cta: t('common.calculate', 'Calculate GST'),
      icon: <Percent size={32} color={colors.white} />,
      gradient: ['#6366F1', '#4F46E5'] as [string, string],
    },
    sip: {
      id: 'finance-sip',
      badge: 'WEALTH BUILDER',
      title: t('calculators.sip.title'),
      desc: t('calculators.sip.description'),
      cta: t('common.calculate', 'Calculate SIP'),
      icon: <TrendingUp size={32} color={colors.white} />,
      gradient: ['#10B981', '#059669'] as [string, string],
    },
  };

  const currentBanner = bannerData[activeBanner];

  const formatHistoryValue = (item: any) => {
    const num = Number(item.value);
    const safeNum = Number.isFinite(num) ? num : 0;
    if (item.type === 'currency') return `₹${safeNum.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    if (item.type === 'percentage') return `${safeNum}%`;
    return String(item.value ?? '');
  };

  return (
    <View style={[styles.mainWrapper, { backgroundColor: colors.background }]}>
      {/* Top Header with Safe Area Insets */}
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
        <View style={styles.headerContent}>
          <View style={styles.brandRow}>
            <HeaderIconBadge name="calculator" size={44} iconSize={22} />
            <View>
              <Text style={[styles.brandTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                Smart Calculator
              </Text>
              <Text style={[styles.brandTagline, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                {t('scan.tagline', 'Professional Financial & Utility Suite')}
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity 
              activeOpacity={0.7}
              style={[styles.headerIconBtn, { backgroundColor: colors.surfaceHighlight, borderColor: colors.borderSubtle }]}
              onPress={() => router.push('/scan' as any)}
            >
              <Camera size={20} color={colors.accent} />
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.7}
              style={[styles.headerIconBtn, { backgroundColor: colors.surfaceHighlight, borderColor: colors.borderSubtle }]}
              onPress={() => router.push('/(tabs)/settings')}
            >
              <SlidersHorizontal size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Localized Offline Search Bar */}
        <View style={styles.searchContainer}>
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
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* If search query is entered, display search results */}
        {searchQuery.trim().length > 0 ? (
          <View style={styles.searchResultsSection}>
            <Text style={[styles.sectionHeading, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
              {t('common.searchResults', 'Search Results')} ({filteredCalculators.length})
            </Text>

            {filteredCalculators.length === 0 ? (
              <View style={[styles.emptySearchBox, { backgroundColor: colors.surface, borderRadius: radius.lg, borderColor: colors.border }]}>
                <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
                  {t('common.noResultsFound', 'No calculators found matching your search.')}
                </Text>
              </View>
            ) : (
              filteredCalculators.map(calc => (
                <TouchableOpacity
                  key={calc.definition.id}
                  activeOpacity={0.7}
                  style={[
                    styles.searchItemCard,
                    { 
                      backgroundColor: colors.surface, 
                      borderRadius: radius.lg,
                      borderColor: colors.border,
                      ...shadows.sm,
                    }
                  ]}
                  onPress={() => {
                    setSearchQuery('');
                    router.push(`/calculator/${calc.definition.id}`);
                  }}
                >
                  <CategoryIcon category={calc.definition.category} calculatorId={calc.definition.id} size={46} iconSize={22} />
                  <View style={styles.searchItemInfo}>
                    <Text style={[styles.searchItemTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                      {t(calc.definition.titleKey)}
                    </Text>
                    <Text numberOfLines={1} style={[styles.searchItemDesc, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                      {t(calc.definition.descriptionKey)}
                    </Text>
                  </View>
                  <ChevronRight size={20} color={colors.textDisabled} />
                </TouchableOpacity>
              ))
            )}
          </View>
        ) : (
          <>
            {/* Featured Calculator Banner */}
            <View style={styles.bannerWrapper}>
              <View style={styles.bannerSelectorRow}>
                {(['emi', 'gst', 'sip'] as const).map(tab => {
                  const isSelected = activeBanner === tab;

                  return (
                    <Pressable
                      key={tab}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      unstable_pressDelay={0}
                      onPress={() => setActiveBanner(tab)}
                      style={({ pressed }) => [
                        styles.bannerTab,
                        {
                          backgroundColor: isSelected
                            ? '#0056D2'
                            : pressed
                            ? (isDarkMode ? '#183D5C' : '#E2EBF6')
                            : (isDarkMode ? '#102B40' : '#F1F5F9'),
                          borderColor: isSelected
                            ? '#0056D2'
                            : pressed
                            ? (isDarkMode ? '#2B5D88' : '#CBD5E1')
                            : (isDarkMode ? '#1E476D' : '#E2E8F0'),
                          opacity: pressed ? 0.9 : 1.0,
                          transform: [{ scale: pressed ? 0.95 : 1.0 }],
                        },
                        isSelected && {
                          shadowColor: '#0056D2',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: isDarkMode ? 0.4 : 0.25,
                          shadowRadius: 4,
                          elevation: 3,
                        },
                      ]}
                    >
                      <Text 
                        style={[
                          styles.bannerTabText, 
                          { 
                            color: isSelected ? '#FFFFFF' : (isDarkMode ? '#CBD5E1' : '#0A1128'), 
                            fontFamily: isSelected ? typography.fontFamily.bold : typography.fontFamily.semiBold,
                          }
                        ]}
                      >
                        {tab.toUpperCase()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.bannerContainer, shadows.lg, { borderRadius: radius.xl }]}
                onPress={() => router.push(`/calculator/${currentBanner.id}`)}
              >
                <GradientView
                  colors={currentBanner.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  borderRadius={radius.xl}
                  style={styles.bannerInner}
                >
                  <View style={styles.bannerHeader}>
                    <View style={styles.bannerBadge}>
                      <Sparkles size={12} color="#FFFFFF" />
                      <Text style={[styles.bannerBadgeText, { fontFamily: typography.fontFamily.bold }]}>
                        {currentBanner.badge}
                      </Text>
                    </View>
                    <View style={styles.bannerIconContainer}>
                      {currentBanner.icon}
                    </View>
                  </View>

                  <Text style={[styles.bannerTitle, { fontFamily: typography.fontFamily.bold }]}>
                    {currentBanner.title}
                  </Text>
                  <Text numberOfLines={2} style={[styles.bannerDesc, { fontFamily: typography.fontFamily.medium }]}>
                    {currentBanner.desc}
                  </Text>

                  <View style={styles.bannerCtaRow}>
                    <View style={[styles.bannerCtaBtn, { backgroundColor: '#FFFFFF' }]}>
                      <Text style={[styles.bannerCtaText, { color: '#071923', fontFamily: typography.fontFamily.bold }]}>
                        {currentBanner.cta}
                      </Text>
                      <ArrowRight size={16} color="#071923" />
                    </View>
                  </View>
                </GradientView>
              </TouchableOpacity>
            </View>

            {/* Quick Access Chips */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionHeading, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                  {t('common.quickAccess', 'Quick Access')}
                </Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
                  <Text style={[styles.seeAllText, { color: colors.primaryLight, fontFamily: typography.fontFamily.semiBold }]}>
                    {t('common.viewAll', 'View All')}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.quickAccessScroll}
              >
                {QUICK_ACCESS_ITEMS.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.75}
                    style={[
                      styles.quickChip,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        borderRadius: radius.lg,
                        ...shadows.sm,
                      }
                    ]}
                    onPress={() => router.push(`/calculator/${item.id}`)}
                  >
                    <CategoryIcon category={item.category} calculatorId={item.id} size={36} iconSize={18} />
                    <Text numberOfLines={1} style={[styles.quickChipText, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                      {t(item.labelKey)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Scan & Calculate Feature Spotlight */}
            <TouchableOpacity 
              activeOpacity={0.85}
              style={[
                styles.scanSpotlightCard, 
                { 
                  backgroundColor: colors.surface, 
                  borderColor: colors.border,
                  borderRadius: radius.xl,
                  ...shadows.md 
                }
              ]}
              onPress={() => router.push('/scan' as any)}
            >
              <View style={styles.scanLeft}>
                <View style={[styles.scanIconBadge, { backgroundColor: `${colors.accent}20`, borderColor: `${colors.accent}40` }]}>
                  <Camera size={26} color={colors.accent} />
                </View>
                <View style={styles.scanTextWrap}>
                  <View style={styles.scanTitleRow}>
                    <Text style={[styles.scanTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                      {t('scan.title', 'Scan & Calculate')}
                    </Text>
                    <View style={[styles.aiBadge, { backgroundColor: `${colors.primary}25` }]}>
                      <Text style={[styles.aiBadgeText, { color: colors.primaryLight, fontFamily: typography.fontFamily.bold }]}>
                        OCR
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.scanDesc, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                    {t('scan.homeBannerDesc', 'Extract values from receipts, bills & papers')}
                  </Text>
                </View>
              </View>
              <ChevronRight size={22} color={colors.textDisabled} />
            </TouchableOpacity>

            {/* Calculator Categories Grid */}
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionHeading, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                {t('common.categories', 'Calculator Categories')}
              </Text>

              <View style={styles.categoryGrid}>
                {CATEGORY_DEFINITIONS.map(cat => {
                  const catColor = getCategoryColor(cat.id, colors);
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      activeOpacity={0.75}
                      style={[
                        styles.categoryCard,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          borderRadius: radius.lg,
                          ...shadows.sm,
                        }
                      ]}
                      onPress={() => router.push({ pathname: '/(tabs)/explore', params: { category: cat.id } })}
                    >
                      <View style={styles.categoryCardTop}>
                        <CategoryIcon category={cat.id} size={44} iconSize={22} />
                        <View style={[styles.countBadge, { backgroundColor: `${catColor}18` }]}>
                          <Text style={[styles.countText, { color: catColor, fontFamily: typography.fontFamily.bold }]}>
                            {cat.count}
                          </Text>
                        </View>
                      </View>

                      <Text style={[styles.categoryCardTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                        {t(cat.titleKey)}
                      </Text>
                      <Text numberOfLines={1} style={[styles.categoryCardSubtitle, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                        {t(cat.descKey)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Home Banner Ad */}
            <GlobalBannerAd placement="home" />

            {/* Recent Calculations Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionHeading, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                  {t('common.recentCalculations', 'Recent Calculations')}
                </Text>
                {recentHistory.length > 0 && (
                  <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
                    <Text style={[styles.seeAllText, { color: colors.primaryLight, fontFamily: typography.fontFamily.semiBold }]}>
                      {t('common.viewAll', 'View All')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {recentHistory.length === 0 ? (
                <View 
                  style={[
                    styles.emptyHistoryCard, 
                    { 
                      backgroundColor: colors.surface, 
                      borderColor: colors.border,
                      borderRadius: radius.lg 
                    }
                  ]}
                >
                  <RotateCcw size={32} color={colors.textDisabled} />
                  <Text style={[styles.emptyHistoryTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                    {t('common.noRecentCalculations', 'No Recent Calculations')}
                  </Text>
                  <Text style={[styles.emptyHistoryDesc, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                    {t('common.historyTip', 'Your completed EMI, GST, or SIP calculations will appear here for fast access.')}
                  </Text>
                  <TouchableOpacity 
                    style={[styles.emptyCtaBtn, { backgroundColor: colors.surfaceHighlight, borderRadius: radius.md }]}
                    onPress={() => router.push('/calculator/finance-emi')}
                  >
                    <Text style={[styles.emptyCtaText, { color: colors.primaryLight, fontFamily: typography.fontFamily.semiBold }]}>
                      {t('common.tryEmi', 'Try EMI Calculator')}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                recentHistory.map(item => {
                  const calc = getCalculator(item.calculatorId);
                  const primaryRes = item.result.items.find(i => i.isPrimary) || item.result.items[0];
                  if (!calc) return null;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.7}
                      style={[
                        styles.historyItemCard,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          borderRadius: radius.lg,
                          ...shadows.sm,
                        }
                      ]}
                      onPress={() => router.push({ pathname: `/calculator/${item.calculatorId}` as any, params: { ...item.inputs } })}
                    >
                      <CategoryIcon category={calc.definition.category} calculatorId={calc.definition.id} size={42} iconSize={20} />
                      <View style={styles.historyInfo}>
                        <Text style={[styles.historyTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                          {t(calc.definition.titleKey)}
                        </Text>
                        <Text style={[styles.historyTime, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                          {new Date(item.timestamp).toLocaleDateString()} • {primaryRes ? t(primaryRes.labelKey) : ''}
                        </Text>
                      </View>
                      <View style={styles.historyRight}>
                        <Text style={[styles.historyValue, { color: colors.primaryLight, fontFamily: typography.fontFamily.bold }]}>
                          {primaryRes ? formatHistoryValue(primaryRes) : ''}
                        </Text>
                        <ChevronRight size={18} color={colors.textDisabled} />
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandLogo: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  brandTitle: {
    fontSize: 18,
    letterSpacing: 0.2,
  },
  brandTagline: {
    fontSize: 12,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  searchContainer: {
    marginTop: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchResultsSection: {
    marginTop: 8,
  },
  sectionHeading: {
    fontSize: 17,
    letterSpacing: 0.2,
    marginBottom: 12,
  },
  emptySearchBox: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  searchItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  searchItemInfo: {
    flex: 1,
  },
  searchItemTitle: {
    fontSize: 15,
  },
  searchItemDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  bannerWrapper: {
    marginBottom: 20,
  },
  bannerSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  bannerTab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    minHeight: 34,
    minWidth: 54,
    borderWidth: 1.5,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTabText: {
    fontSize: 12,
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  bannerContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  bannerInner: {
    padding: 20,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bannerBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    letterSpacing: 0.6,
  },
  bannerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    marginBottom: 6,
  },
  bannerDesc: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 18,
  },
  bannerCtaRow: {
    flexDirection: 'row',
  },
  bannerCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  bannerCtaText: {
    fontSize: 13,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 13,
  },
  quickAccessScroll: {
    gap: 10,
    paddingRight: 8,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  quickChipText: {
    fontSize: 13,
    maxWidth: 130,
  },
  scanSpotlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  scanLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    marginRight: 10,
  },
  scanIconBadge: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  scanTextWrap: {
    flex: 1,
  },
  scanTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  scanTitle: {
    fontSize: 16,
  },
  aiBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  aiBadgeText: {
    fontSize: 10,
  },
  scanDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    padding: 14,
    borderWidth: 1,
  },
  categoryCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  countText: {
    fontSize: 11,
  },
  categoryCardTitle: {
    fontSize: 15,
    marginBottom: 4,
  },
  categoryCardSubtitle: {
    fontSize: 12,
  },
  emptyHistoryCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  emptyHistoryTitle: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  emptyHistoryDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  emptyCtaBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  emptyCtaText: {
    fontSize: 13,
  },
  historyItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 11,
  },
  historyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyValue: {
    fontSize: 15,
  },
});
