import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';

interface CountdownTimerProps {
  targetDate: Date;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const { colors, typography, radius, shadows } = useAppTheme();
  const { t } = useTranslation();
  
  function calculateTimeLeft(target: Date) {
    const diff = target.getTime() - new Date().getTime();
    if (diff <= 0) return null;
    
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <View style={[styles.container, styles.reachedContainer, { backgroundColor: `${colors.success}15`, borderColor: `${colors.success}30`, borderRadius: radius.lg }]}>
        <Text style={[styles.reachedText, { color: colors.success, fontFamily: typography.fontFamily.bold }]}>
          {t('calculators.dateTime.countdown.reached', 'Countdown Completed!')}
        </Text>
      </View>
    );
  }

  const renderBlock = (value: number, labelKey: string) => (
    <View 
      style={[
        styles.tile, 
        { 
          backgroundColor: colors.surface, 
          borderColor: colors.borderSubtle,
          borderRadius: radius.md,
          ...shadows.sm,
        }
      ]}
    >
      <Text style={[styles.value, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
        {String(value).padStart(2, '0')}
      </Text>
      <Text style={[styles.label, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
        {t(labelKey)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {renderBlock(timeLeft.days, 'calculators.dateTime.countdown.days')}
        <Text style={[styles.colon, { color: colors.textSecondary }]}>:</Text>
        {renderBlock(timeLeft.hours, 'calculators.dateTime.countdown.hours')}
        <Text style={[styles.colon, { color: colors.textSecondary }]}>:</Text>
        {renderBlock(timeLeft.minutes, 'calculators.dateTime.countdown.minutes')}
        <Text style={[styles.colon, { color: colors.textSecondary }]}>:</Text>
        {renderBlock(timeLeft.seconds, 'calculators.dateTime.countdown.seconds')}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  reachedContainer: {
    padding: 16,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    minWidth: 64,
    borderWidth: 1,
  },
  colon: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  value: {
    fontSize: 24,
    lineHeight: 28,
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reachedText: {
    fontSize: 18,
    textAlign: 'center',
  }
});
