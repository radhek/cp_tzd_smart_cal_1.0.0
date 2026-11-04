import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';

export interface BaseInputProps extends Omit<TextInputProps, 'onChange'> {
  labelKey: string;
  value: string;
  onChange: (val: string) => void;
  errorKey?: string;
  helperText?: string;
  prefix?: string;
  suffix?: string;
}

export function NumberInput({ 
  labelKey, 
  value, 
  onChange, 
  errorKey, 
  helperText,
  prefix, 
  suffix,
  placeholder,
  ...props 
}: BaseInputProps) {
  const { colors, typography, radius } = useAppTheme();
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (errorKey) return colors.error;
    if (isFocused) return colors.inputFocusBorder;
    return colors.inputBorder;
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
          {t(labelKey)}
        </Text>
      </View>
      
      <View 
        style={[
          styles.inputContainer,
          { 
            backgroundColor: colors.inputBackground, 
            borderColor: getBorderColor(),
            borderRadius: radius.md,
            borderWidth: isFocused || errorKey ? 1.5 : 1,
          }
        ]}
      >
        {prefix && (
          <View style={[styles.affixBadge, { backgroundColor: colors.surfaceHighlight }]}>
            <Text style={[styles.affixText, { color: colors.textSecondary, fontFamily: typography.fontFamily.semiBold }]}>
              {prefix}
            </Text>
          </View>
        )}
        
        <TextInput
          style={[
            styles.input, 
            { 
              color: colors.text, 
              fontFamily: typography.fontFamily.medium,
              fontSize: typography.size.md,
            }
          ]}
          value={value}
          onChangeText={onChange}
          keyboardType="numeric"
          placeholder={placeholder || '0'}
          placeholderTextColor={colors.textDisabled}
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />
        
        {suffix && (
          <View style={[styles.affixBadge, { backgroundColor: colors.surfaceHighlight }]}>
            <Text style={[styles.affixText, { color: colors.textSecondary, fontFamily: typography.fontFamily.semiBold }]}>
              {suffix}
            </Text>
          </View>
        )}
      </View>
      
      {errorKey && (
        <Text style={[styles.error, { color: colors.error, fontFamily: typography.fontFamily.regular }]}>
          {t(errorKey)}
        </Text>
      )}

      {helperText && !errorKey && (
        <Text style={[styles.helper, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
          {helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 8,
  },
  affixBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  affixText: {
    fontSize: 14,
  },
  error: {
    marginTop: 6,
    fontSize: 12,
  },
  helper: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.8,
  },
});

// Derived Inputs for specific uses
export function CurrencyInput(props: Omit<BaseInputProps, 'prefix'>) {
  return <NumberInput {...props} prefix="₹" />;
}

export function PercentageInput(props: Omit<BaseInputProps, 'suffix'>) {
  return <NumberInput {...props} suffix="%" />;
}

export function DurationInput(props: Omit<BaseInputProps, 'suffix'> & { unitKey?: string }) {
  const { t } = useTranslation();
  return <NumberInput {...props} suffix={props.unitKey ? t(props.unitKey) : t('common.years')} />;
}
