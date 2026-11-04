import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  SafeAreaView 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../theme/useAppTheme';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { 
  Sun, 
  Moon, 
  Smartphone, 
  Languages, 
  ShieldCheck, 
  Info, 
  Check, 
  ChevronRight, 
  X,
  FileText,
  SlidersHorizontal,
  SunMoon
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderIconBadge } from '../../components/common/HeaderIconBadge';
import { analyticsService } from '../../services/analytics/AnalyticsService';
import { adsService } from '../../services/ads/AdsService';

const THEME_OPTIONS: { id: 'light' | 'dark' | 'system'; labelKey: string }[] = [
  { id: 'system', labelKey: 'settings.system' },
  { id: 'dark', labelKey: 'settings.dark' },
  { id: 'light', labelKey: 'settings.light' },
];

const LANGUAGE_OPTIONS = [
  { id: 'en' as const, label: 'English', subLabel: 'English' },
  { id: 'hi' as const, label: 'हिंदी', subLabel: 'Hindi' },
  { id: 'gu' as const, label: 'ગુજરાતી', subLabel: 'Gujarati' },
];

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { colors, typography, radius, shadows, isDarkMode } = useAppTheme();
  const insets = useSafeAreaInsets();
  
  const theme = usePreferencesStore((state) => state.theme);
  const language = usePreferencesStore((state) => state.language);
  const setTheme = usePreferencesStore((state) => state.setTheme);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);

  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [isPrivacyOptionsRequired, setIsPrivacyOptionsRequired] = useState(false);

  React.useEffect(() => {
    adsService.getPrivacyOptionsRequired().then(setIsPrivacyOptionsRequired);
  }, []);

  const handlePrivacyOptions = async () => {
    try {
      await adsService.showPrivacyOptionsForm();
      const required = await adsService.getPrivacyOptionsRequired();
      setIsPrivacyOptionsRequired(required);
    } catch (e) {
      console.warn('[Settings] Failed to show privacy options form:', e);
    }
  };

  const handleLanguageChange = (lang: 'en' | 'hi' | 'gu') => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    analyticsService.trackEvent('language_changed', { language: lang });
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    analyticsService.trackEvent('theme_changed', { theme: newTheme });
  };

  const iconColor = isDarkMode ? '#5C99FF' : '#0056D2';
  const neutralIconColor = isDarkMode ? '#94A3B8' : '#475569';

  const renderThemeIcon = (id: 'light' | 'dark' | 'system', isSelected: boolean) => {
    const color = isSelected ? '#FFFFFF' : neutralIconColor;
    switch (id) {
      case 'system':
        return <Smartphone size={18} color={color} />;
      case 'dark':
        return <Moon size={18} color={color} />;
      case 'light':
        return <Sun size={18} color={color} />;
    }
  };

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
          <HeaderIconBadge name="settings" size={42} iconSize={22} />
          <View>
            <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
              {t('common.settings', 'Settings')}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
              {t('settings.subtitle', 'Preferences, language and app information')}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SunMoon size={18} color={iconColor} />
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: typography.fontFamily.semiBold }]}>
              {t('settings.theme', 'Appearance')}
            </Text>
          </View>

          <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.xl, ...shadows.sm }]}>
            <View style={styles.themeRow}>
              {THEME_OPTIONS.map((opt) => {
                const isSelected = theme === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    activeOpacity={0.8}
                    style={[
                      styles.themeCard,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceElevated,
                        borderColor: isSelected ? colors.primary : colors.borderSubtle,
                        borderRadius: radius.lg,
                      },
                      isSelected && shadows.sm,
                    ]}
                    onPress={() => handleThemeChange(opt.id)}
                  >
                    {renderThemeIcon(opt.id, isSelected)}
                    <Text 
                      style={[
                        styles.themeLabel, 
                        { 
                          color: isSelected ? colors.white : colors.text, 
                          fontFamily: isSelected ? typography.fontFamily.semiBold : typography.fontFamily.medium 
                        }
                      ]}
                    >
                      {t(opt.labelKey)}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkIndicator}>
                        <Check size={14} color={colors.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Languages size={18} color={iconColor} />
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: typography.fontFamily.semiBold }]}>
              {t('settings.language', 'Language / भाषा / ભાષા')}
            </Text>
          </View>

          <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.xl, ...shadows.sm }]}>
            {LANGUAGE_OPTIONS.map((lang, idx) => {
              const isSelected = language === lang.id;
              return (
                <TouchableOpacity
                  key={lang.id}
                  activeOpacity={0.7}
                  style={[
                    styles.langRow,
                    idx < LANGUAGE_OPTIONS.length - 1 && { borderBottomColor: colors.divider, borderBottomWidth: StyleSheet.hairlineWidth },
                    isSelected && { backgroundColor: `${colors.primary}12` }
                  ]}
                  onPress={() => handleLanguageChange(lang.id)}
                >
                  <View>
                    <Text style={[styles.langPrimary, { color: isSelected ? iconColor : colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                      {lang.label}
                    </Text>
                    <Text style={[styles.langSecondary, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                      {lang.subLabel}
                    </Text>
                  </View>

                  {isSelected && (
                    <View style={[styles.langCheckBadge, { backgroundColor: colors.primary }]}>
                      <Check size={16} color={colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Privacy & Legal Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ShieldCheck size={18} color={iconColor} />
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: typography.fontFamily.semiBold }]}>
              {t('settings.legal', 'Privacy & Security')}
            </Text>
          </View>

          <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.xl, ...shadows.sm }]}>
            <TouchableOpacity 
              activeOpacity={0.7}
              style={[styles.menuItem, { borderBottomColor: colors.divider, borderBottomWidth: StyleSheet.hairlineWidth }]}
              onPress={() => setPrivacyModalVisible(true)}
            >
              <View style={styles.menuLeft}>
                <FileText size={18} color={iconColor} />
                <Text style={[styles.menuText, { color: colors.text, fontFamily: typography.fontFamily.medium }]}>
                  {t('settings.privacyPolicy', 'Privacy Policy')}
                </Text>
              </View>
              <ChevronRight size={18} color={colors.textDisabled} />
            </TouchableOpacity>

            {isPrivacyOptionsRequired && (
              <TouchableOpacity 
                activeOpacity={0.7}
                style={[styles.menuItem, { borderBottomColor: colors.divider, borderBottomWidth: StyleSheet.hairlineWidth }]}
                onPress={handlePrivacyOptions}
              >
                <View style={styles.menuLeft}>
                  <SlidersHorizontal size={18} color={iconColor} />
                  <Text style={[styles.menuText, { color: colors.text, fontFamily: typography.fontFamily.medium }]}>
                    {t('settings.privacyOptions', 'Ad Privacy Choices')}
                  </Text>
                </View>
                <ChevronRight size={18} color={colors.textDisabled} />
              </TouchableOpacity>
            )}

            <View style={styles.infoRow}>
              <ShieldCheck size={18} color={colors.success} style={{ marginRight: 10, marginTop: 2 }} />
              <Text style={[styles.infoText, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                {t('settings.offlineNotice', 'All calculations and OCR processing run 100% offline on your device. Your sensitive financial data is never sent to any cloud server.')}
              </Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={18} color={iconColor} />
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: typography.fontFamily.semiBold }]}>
              {t('settings.about', 'About Smart Calculator')}
            </Text>
          </View>

          <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.xl, ...shadows.sm, padding: 18 }]}>
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
                {t('settings.version', 'App Version')}
              </Text>
              <Text style={[styles.aboutValue, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                1.0.0
              </Text>
            </View>

            <View style={[styles.aboutRow, { marginTop: 12 }]}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
                {t('settings.engine', 'Calculation Engine')}
              </Text>
              <Text style={[styles.aboutValue, { color: colors.success, fontFamily: typography.fontFamily.semiBold }]}>
                Verified Deterministic
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Privacy Policy Modal */}
      <Modal 
        visible={privacyModalVisible} 
        transparent 
        animationType="slide" 
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalSafeArea, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.xl }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.divider }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <FileText size={22} color={iconColor} />
                <Text style={[styles.modalTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                  {t('settings.privacyPolicy', 'Privacy Policy')}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setPrivacyModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} contentContainerStyle={{ padding: 18 }}>
              <Text style={[styles.policyHeading, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                1. Zero Financial Data Collection
              </Text>
              <Text style={[styles.policyParagraph, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                Smart Calculator is strictly an offline utility application. All mathematical operations, loan calculations, GST computations, and currency unit conversions occur entirely on your device. Your financial entries, incomes, investments, and loan numbers are never transmitted, recorded, or monitored.
              </Text>

              <Text style={[styles.policyHeading, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                2. On-Device OCR & Image Privacy
              </Text>
              <Text style={[styles.policyParagraph, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                When utilizing the Scan & Calculate camera or gallery feature, image processing is executed on-device using Google ML Kit. No photographs, invoices, or scanned documents are uploaded to any external server.
              </Text>

              <Text style={[styles.policyHeading, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                3. Advertising & Analytics
              </Text>
              <Text style={[styles.policyParagraph, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                Smart Calculator uses Google AdMob to display non-intrusive advertisements to support free usage. Centralized frequency capping is implemented to prevent spam or intrusion during calculations. General app diagnostic telemetry is collected anonymously via Firebase Analytics without personal identification.
              </Text>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  groupCard: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  themeRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 10,
  },
  themeCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    gap: 6,
    position: 'relative',
  },
  themeLabel: {
    fontSize: 13,
  },
  checkIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  langPrimary: {
    fontSize: 16,
  },
  langSecondary: {
    fontSize: 12,
    marginTop: 2,
  },
  langCheckBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aboutLabel: {
    fontSize: 14,
  },
  aboutValue: {
    fontSize: 14,
  },
  modalSafeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxHeight: '80%',
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 17,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalScroll: {
    flex: 1,
  },
  policyHeading: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 6,
  },
  policyParagraph: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
});
