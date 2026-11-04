import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  TextInput 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { 
  Camera, 
  Image as ImageIcon, 
  AlertCircle, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  Scan
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAppTheme } from '../theme/useAppTheme';
import { pickImageAndRecognize } from '../features/scan/ocr/runner';
import { ParsedOCRResult } from '../features/scan/parser/types';
import { getCalculator } from '../calculators/registry';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { analyticsService } from '../services/analytics/AnalyticsService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryIcon } from '../components/common/CategoryIcon';

export default function ScanScreen() {
  const { t } = useTranslation();
  const { colors, typography, radius, shadows, isDarkMode } = useAppTheme();
  const insets = useSafeAreaInsets();
  
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ParsedOCRResult | null>(null);
  const [editedInputs, setEditedInputs] = useState<Record<string, string>>({});

  const handleScan = async (useCamera: boolean) => {
    setIsScanning(true);
    setResult(null);
    setEditedInputs({});
    analyticsService.trackEvent('scan_started', { scan_source: useCamera ? 'camera' : 'gallery' });
    
    try {
      const ocrResult = await pickImageAndRecognize(useCamera);
      if (ocrResult === null) {
        analyticsService.trackEvent('scan_failed');
      } else {
        analyticsService.trackEvent('scan_completed');
        setResult(ocrResult);
        // Pre-fill editable inputs
        const initialMap: Record<string, string> = {};
        Object.entries(ocrResult.detectedInputs).forEach(([key, val]) => {
          initialMap[key] = String(val);
        });
        setEditedInputs(initialMap);
      }
    } catch (e) {
      analyticsService.trackEvent('scan_failed');
      console.warn(e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleInputChange = (fieldKey: string, newVal: string) => {
    setEditedInputs(prev => ({
      ...prev,
      [fieldKey]: newVal,
    }));
  };

  const navigateToCalculator = () => {
    if (!result || !result.calculatorId) return;
    router.push({
      pathname: `/calculator/${result.calculatorId}` as any,
      params: { ...result.detectedInputs, ...editedInputs }
    });
  };

  const getConfidenceColor = (confidence: string) => {
    if (confidence === 'HIGH') return '#10B981';
    if (confidence === 'MEDIUM') return '#F59E0B';
    return '#EF4444';
  };

  const suggestedCalculator = result?.calculatorId ? getCalculator(result.calculatorId) : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Bar */}
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
        <View style={styles.headerRow}>
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => router.back()} 
            style={styles.backBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
              {t('scan.title', 'Scan & Calculate')}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
              {t('scan.offlineBadge', '100% On-Device OCR')}
            </Text>
          </View>

          <View style={{ width: 36 }} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Initial Launcher State */}
        {!result && !isScanning && (
          <View style={styles.initialState}>
            {/* Viewfinder Graphic / Hero Card */}
            <View 
              style={[
                styles.viewfinderCard, 
                { 
                  backgroundColor: colors.surface, 
                  borderColor: colors.border,
                  borderRadius: radius.xxl,
                  ...shadows.md,
                }
              ]}
            >
              <View style={styles.viewfinderFrame}>
                <View style={[styles.corner, styles.cornerTL, { borderColor: colors.accent }]} />
                <View style={[styles.corner, styles.cornerTR, { borderColor: colors.accent }]} />
                <View style={[styles.corner, styles.cornerBL, { borderColor: colors.accent }]} />
                <View style={[styles.corner, styles.cornerBR, { borderColor: colors.accent }]} />

                <View style={[styles.scannerIconWrap, { backgroundColor: `${colors.accent}15` }]}>
                  <Scan size={44} color={colors.accent} />
                </View>
              </View>

              <Text style={[styles.launcherTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                {t('scan.pointCamera', 'Scan Invoices, Bills or Notes')}
              </Text>
              <Text style={[styles.launcherDesc, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                {t('scan.description', 'Extract prices, GST, interest rates, or loan terms automatically using high-speed on-device optical character recognition.')}
              </Text>
            </View>

            {/* Launch Action Cards */}
            <View style={styles.actionsWrap}>
              <TouchableOpacity 
                activeOpacity={0.8}
                style={[
                  styles.launchCard, 
                  { 
                    backgroundColor: colors.surface, 
                    borderColor: colors.border,
                    borderRadius: radius.xl,
                    ...shadows.sm,
                  }
                ]} 
                onPress={() => handleScan(true)}
              >
                <View style={[styles.launchIconBox, { backgroundColor: `${colors.accent}18` }]}>
                  <Camera color={colors.accent} size={28} />
                </View>
                <View style={styles.launchTextWrap}>
                  <Text style={[styles.launchTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                    {t('scan.takePhoto', 'Scan with Camera')}
                  </Text>
                  <Text style={[styles.launchSub, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                    {t('scan.takePhotoDesc', 'Capture printed receipt or document')}
                  </Text>
                </View>
                <ArrowRight size={18} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity 
                activeOpacity={0.8}
                style={[
                  styles.launchCard, 
                  { 
                    backgroundColor: colors.surface, 
                    borderColor: colors.border,
                    borderRadius: radius.xl,
                    ...shadows.sm,
                  }
                ]} 
                onPress={() => handleScan(false)}
              >
                <View style={[styles.launchIconBox, { backgroundColor: `${colors.primaryLight}18` }]}>
                  <ImageIcon color={colors.primaryLight} size={28} />
                </View>
                <View style={styles.launchTextWrap}>
                  <Text style={[styles.launchTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                    {t('scan.fromGallery', 'Choose from Photos')}
                  </Text>
                  <Text style={[styles.launchSub, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                    {t('scan.fromGalleryDesc', 'Select saved screenshot or invoice image')}
                  </Text>
                </View>
                <ArrowRight size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Scanning Progress State */}
        {isScanning && (
          <View 
            style={[
              styles.loadingBox, 
              { 
                backgroundColor: colors.surface, 
                borderColor: colors.border,
                borderRadius: radius.xl,
                ...shadows.md,
              }
            ]}
          >
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.loadingTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
              {t('scan.analyzing', 'Analyzing Document...')}
            </Text>
            <Text style={[styles.loadingDesc, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
              {t('scan.processingLocally', 'Extracting numerical values on-device with ML Kit OCR')}
            </Text>
          </View>
        )}

        {/* Results State */}
        {result && !isScanning && (
          <View style={styles.resultContainer}>
            {result.sourceText.length === 0 ? (
              <View 
                style={[
                  styles.noTextBox, 
                  { 
                    backgroundColor: colors.surface, 
                    borderColor: colors.border,
                    borderRadius: radius.xl,
                    ...shadows.md,
                  }
                ]}
              >
                <AlertCircle color={colors.error} size={48} />
                <Text style={[styles.noTextTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                  {t('scan.noTextDetected', "Couldn't detect readable text")}
                </Text>
                <Text style={[styles.noTextDesc, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                  {t('scan.noTextHint', 'Make sure the image is well lit, in focus, and contains clear legible numbers.')}
                </Text>
                <View style={{ width: '100%', marginTop: 12 }}>
                  <PrimaryButton 
                    label={t('scan.tryAgain', 'Try Another Image')} 
                    icon={<RotateCcw size={18} color="#FFFFFF" />}
                    onPress={() => setResult(null)} 
                  />
                </View>
              </View>
            ) : (
              <View>
                {/* Confidence & Detection Card */}
                <View 
                  style={[
                    styles.detectedCard, 
                    { 
                      backgroundColor: colors.surface, 
                      borderColor: colors.border,
                      borderRadius: radius.xl,
                      ...shadows.sm,
                    }
                  ]}
                >
                  <View style={styles.detectedHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Sparkles size={18} color={colors.primaryLight} />
                      <Text style={[styles.detectedTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                        {t('scan.detectedValues', 'Recognized Values')}
                      </Text>
                    </View>

                    <View style={[styles.confidenceBadge, { backgroundColor: `${getConfidenceColor(result.confidence)}18` }]}>
                      <Text style={[styles.confidenceText, { color: getConfidenceColor(result.confidence), fontFamily: typography.fontFamily.bold }]}>
                        {result.confidence} CONFIDENCE
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.editableNote, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                    {t('scan.editableNote', 'Review and tweak any value before calculating:')}
                  </Text>

                  {/* Editable Fields List */}
                  {Object.entries(result.detectedInputs).map(([key]) => (
                    <View key={key} style={styles.fieldRow}>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
                        {key}
                      </Text>
                      <TextInput
                        style={[
                          styles.fieldInput, 
                          { 
                            backgroundColor: colors.inputBackground, 
                            borderColor: colors.inputBorder,
                            color: colors.text,
                            fontFamily: typography.fontFamily.semiBold,
                            borderRadius: radius.md,
                          }
                        ]}
                        value={editedInputs[key] || ''}
                        onChangeText={(txt) => handleInputChange(key, txt)}
                        keyboardType="numeric"
                      />
                    </View>
                  ))}
                </View>

                {/* Suggested Calculator Card */}
                {suggestedCalculator ? (
                  <View 
                    style={[
                      styles.suggestedCard, 
                      { 
                        backgroundColor: colors.surfaceElevated, 
                        borderColor: colors.border,
                        borderRadius: radius.xl,
                        ...shadows.md,
                      }
                    ]}
                  >
                    <View style={styles.suggestedTop}>
                      <CategoryIcon 
                        category={suggestedCalculator.definition.category} 
                        calculatorId={suggestedCalculator.definition.id} 
                        size={48} 
                        iconSize={24} 
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.suggestedSubtitle, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
                          {t('scan.matchedTool', 'MATCHED CALCULATOR')}
                        </Text>
                        <Text style={[styles.suggestedTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                          {t(suggestedCalculator.definition.titleKey)}
                        </Text>
                      </View>
                    </View>

                    <View style={{ marginTop: 14 }}>
                      <PrimaryButton 
                        label={t('scan.useDetected', 'Apply Values & Calculate')} 
                        icon={<CheckCircle2 size={18} color="#FFFFFF" />}
                        onPress={navigateToCalculator} 
                        size="lg"
                      />
                    </View>
                  </View>
                ) : (
                  <View 
                    style={[
                      styles.noMatchBox, 
                      { 
                        backgroundColor: colors.surface, 
                        borderColor: colors.border,
                        borderRadius: radius.xl,
                      }
                    ]}
                  >
                    <Text style={[styles.noMatchTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                      {t('scan.noMatch', 'No matching calculator detected.')}
                    </Text>
                    <Text style={[styles.noMatchDesc, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                      {t('scan.noMatchDesc', 'Choose a calculator manually to apply these numbers.')}
                    </Text>
                    <View style={{ marginTop: 12 }}>
                      <PrimaryButton 
                        label={t('scan.chooseCalc', 'Browse All Calculators')} 
                        onPress={() => router.push('/(tabs)/explore')} 
                      />
                    </View>
                  </View>
                )}

                {/* Raw Scanned Text Accordion/Preview */}
                <View 
                  style={[
                    styles.rawTextBox, 
                    { 
                      backgroundColor: colors.surface, 
                      borderColor: colors.borderSubtle,
                      borderRadius: radius.lg,
                    }
                  ]}
                >
                  <Text style={[styles.rawTextHeading, { color: colors.textSecondary, fontFamily: typography.fontFamily.semiBold }]}>
                    {t('scan.rawScannedText', 'Scanned Document OCR Text')}
                  </Text>
                  <Text style={[styles.rawTextContent, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                    {result.sourceText}
                  </Text>
                </View>

                {/* Scan Another Image Action */}
                <View style={{ marginTop: 16 }}>
                  <PrimaryButton 
                    variant="secondary" 
                    label={t('scan.tryAnother', 'Scan Another Image')} 
                    icon={<RotateCcw size={16} color={colors.text} />}
                    onPress={() => setResult(null)} 
                  />
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 6,
    marginLeft: -6,
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  initialState: {
    paddingTop: 6,
  },
  viewfinderCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 20,
  },
  viewfinderFrame: {
    width: 140,
    height: 140,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  scannerIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderWidth: 3,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  launcherTitle: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  launcherDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  actionsWrap: {
    gap: 12,
  },
  launchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    gap: 14,
  },
  launchIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  launchTextWrap: {
    flex: 1,
  },
  launchTitle: {
    fontSize: 15,
    marginBottom: 3,
  },
  launchSub: {
    fontSize: 12,
  },
  loadingBox: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginTop: 40,
  },
  loadingTitle: {
    fontSize: 17,
    marginTop: 18,
    marginBottom: 6,
  },
  loadingDesc: {
    fontSize: 13,
    textAlign: 'center',
  },
  resultContainer: {
    paddingTop: 4,
  },
  noTextBox: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginTop: 20,
  },
  noTextTitle: {
    fontSize: 17,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noTextDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  detectedCard: {
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  detectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detectedTitle: {
    fontSize: 16,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  confidenceText: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  editableNote: {
    fontSize: 12,
    marginBottom: 14,
  },
  fieldRow: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  fieldInput: {
    height: 46,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  suggestedCard: {
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  suggestedTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  suggestedSubtitle: {
    fontSize: 10,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  suggestedTitle: {
    fontSize: 17,
  },
  noMatchBox: {
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  noMatchTitle: {
    fontSize: 15,
    marginBottom: 4,
    textAlign: 'center',
  },
  noMatchDesc: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  rawTextBox: {
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  rawTextHeading: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  rawTextContent: {
    fontSize: 12,
    lineHeight: 17,
  },
});
