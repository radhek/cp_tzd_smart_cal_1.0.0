import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';
import { GradientView } from '../common/GradientView';

interface SegmentOption {
  labelKey: string;
  value: string | number;
}

interface SegmentedInputProps {
  labelKey?: string;
  value: string | number;
  options: SegmentOption[];
  onChange: (val: string | number) => void;
  errorKey?: string;
}

export function SegmentedInput({ labelKey, value, options, onChange, errorKey }: SegmentedInputProps) {
  const { colors, typography, radius, shadows } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {labelKey && (
        <Text style={[styles.label, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
          {t(labelKey)}
        </Text>
      )}
      
      <View 
        style={[
          styles.segmentContainer, 
          { 
            backgroundColor: colors.inputBackground, 
            borderColor: errorKey ? colors.error : colors.inputBorder, 
            borderRadius: radius.md,
            borderWidth: 1,
            padding: 4,
          }
        ]}
      >
        {options.map((opt) => {
          const isSelected = String(opt.value) === String(value);
          return (
            <TouchableOpacity
              key={String(opt.value)}
              activeOpacity={0.8}
              style={[
                styles.segment,
                { borderRadius: radius.sm },
                isSelected && shadows.sm,
              ]}
              onPress={() => onChange(opt.value)}
            >
              {isSelected ? (
                <GradientView
                  colors={[colors.primary, colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  borderRadius={radius.sm}
                  style={StyleSheet.absoluteFill}
                />
              ) : null}

              <Text
                style={{
                  color: isSelected ? colors.white : colors.textSecondary,
                  fontFamily: isSelected ? typography.fontFamily.semiBold : typography.fontFamily.medium,
                  fontSize: 13,
                  zIndex: 1,
                }}
              >
                {t(opt.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {errorKey && (
        <Text style={[styles.error, { color: colors.error, fontFamily: typography.fontFamily.regular }]}>
          {t(errorKey)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  segmentContainer: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
  },
  segment: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  error: {
    marginTop: 6,
    fontSize: 12,
  },
});
