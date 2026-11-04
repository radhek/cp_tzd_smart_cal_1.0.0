import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppTheme } from '../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react-native';

export interface DateInputProps {
  labelKey: string;
  value: Date;
  onChange: (val: Date) => void;
  errorKey?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

export function DateInput({ labelKey, value, onChange, errorKey, minimumDate, maximumDate }: DateInputProps) {
  const { colors, typography, radius, spacing } = useAppTheme();
  const { t, i18n } = useTranslation();
  const [show, setShow] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(value);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
        {t(labelKey)}
      </Text>
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => setShow(true)}
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.inputBackground,
            borderColor: errorKey ? colors.error : colors.inputBorder,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
          }
        ]}
      >
        <Calendar size={18} color={colors.textSecondary} style={styles.icon} />
        <Text style={[styles.dateText, { color: colors.text, fontFamily: typography.fontFamily.medium }]}>
          {formattedDate}
        </Text>
      </TouchableOpacity>
      
      {errorKey && (
        <Text style={[styles.errorText, { color: colors.error, fontFamily: typography.fontFamily.regular }]}>
          {t(errorKey)}
        </Text>
      )}

      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
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
    borderWidth: 1,
    height: 52,
  },
  icon: {
    marginRight: 12,
  },
  dateText: {
    fontSize: 15,
    flex: 1,
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
  },
});
