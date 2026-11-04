import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, SafeAreaView } from 'react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Check, X } from 'lucide-react-native';

export interface SelectInputProps {
  labelKey: string;
  value: string | number;
  options: { labelKey: string; value: string | number }[];
  onChange: (val: string | number) => void;
  errorKey?: string;
}

export function SelectInput({ labelKey, value, options, onChange, errorKey }: SelectInputProps) {
  const { colors, typography, radius, spacing, shadows } = useAppTheme();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find(o => String(o.value) === String(value));

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
        {t(labelKey)}
      </Text>
      
      <TouchableOpacity 
        activeOpacity={0.7}
        style={[
          styles.inputContainer, 
          { 
            backgroundColor: colors.inputBackground, 
            borderColor: errorKey ? colors.error : colors.inputBorder,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
          }
        ]}
        onPress={() => setVisible(true)}
      >
        <Text 
          numberOfLines={1} 
          style={[
            styles.valueText, 
            { 
              color: selectedOption ? colors.text : colors.textDisabled, 
              fontFamily: typography.fontFamily.medium 
            }
          ]}
        >
          {selectedOption ? t(selectedOption.labelKey) : t('common.select', 'Select an option')}
        </Text>
        <ChevronDown size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      {errorKey && (
        <Text style={[styles.errorText, { color: colors.error, fontFamily: typography.fontFamily.regular }]}>
          {t(errorKey)}
        </Text>
      )}

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <SafeAreaView style={styles.safeArea}>
            <View 
              style={[
                styles.modalContent, 
                { 
                  backgroundColor: colors.surface, 
                  borderRadius: radius.xl,
                  borderColor: colors.border,
                  ...shadows.lg,
                }
              ]}
              onStartShouldSetResponder={() => true}
            >
              <View style={[styles.modalHeader, { borderBottomColor: colors.divider }]}>
                <Text style={[styles.modalTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                  {t(labelKey)}
                </Text>
                <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeBtn}>
                  <X size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <FlatList
                data={options}
                keyExtractor={(item) => String(item.value)}
                style={styles.optionsList}
                renderItem={({ item }) => {
                  const isSelected = String(item.value) === String(value);
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[
                        styles.optionItem, 
                        { 
                          backgroundColor: isSelected ? colors.surfaceHighlight : 'transparent',
                          borderBottomColor: colors.divider 
                        }
                      ]}
                      onPress={() => {
                        onChange(item.value);
                        setVisible(false);
                      }}
                    >
                      <Text 
                        style={[
                          styles.optionText, 
                          { 
                            color: isSelected ? colors.primaryLight : colors.text, 
                            fontFamily: isSelected ? typography.fontFamily.semiBold : typography.fontFamily.regular 
                          }
                        ]}
                      >
                        {t(item.labelKey)}
                      </Text>
                      {isSelected && (
                        <Check size={18} color={colors.primaryLight} />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    height: 52,
  },
  valueText: {
    fontSize: 15,
    flex: 1,
    marginRight: 8,
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  safeArea: {
    width: '100%',
    maxWidth: 420,
  },
  modalContent: {
    width: '100%',
    maxHeight: 480,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
  },
  closeBtn: {
    padding: 4,
  },
  optionsList: {
    paddingVertical: 6,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
  },
});
