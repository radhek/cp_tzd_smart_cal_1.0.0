import React from 'react';
import { 
  Pressable, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  View, 
  StyleProp, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import { GradientView } from '../common/GradientView';

export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  size?: 'sm' | 'md' | 'lg';
}

const BUTTON_RADIUS = 16; // Soft, modern rounded corners (~14-16px)

export function PrimaryButton({
  label,
  onPress,
  isLoading,
  disabled,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  size = 'md',
}: PrimaryButtonProps) {
  const { colors, typography, shadows, isDarkMode } = useAppTheme();

  const getHeight = () => {
    switch (size) {
      case 'sm':
        return 42;
      case 'lg':
        return 54;
      case 'md':
      default:
        return 48;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return typography.size.sm;
      case 'lg':
        return typography.size.md + 1; // 17px
      case 'md':
      default:
        return typography.size.md;
    }
  };

  const isPrimary = variant === 'primary';

  const getBackgroundColor = () => {
    if (disabled) return colors.surfaceHighlight;
    if (variant === 'secondary') return colors.surfaceElevated;
    if (variant === 'outline' || variant === 'ghost') return 'transparent';
    if (variant === 'danger') return colors.error;
    return 'transparent'; // handled by gradient
  };

  const getBorderColor = () => {
    if (disabled) return colors.borderSubtle;
    if (variant === 'outline') return colors.border;
    if (variant === 'secondary') return colors.border;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return colors.textDisabled;
    if (variant === 'secondary') return colors.text;
    if (variant === 'outline') return colors.text;
    if (variant === 'ghost') return colors.primary;
    if (variant === 'danger') return colors.white;
    return colors.white;
  };

  // Subtle modern shadow with depth for primary gradient button
  const primaryShadow = {
    shadowColor: colors.accentGradientStart || '#FF7A1A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: isDarkMode ? 0.35 : 0.22,
    shadowRadius: 6,
    elevation: 3,
  };

  const content = (
    <View style={styles.contentRow} pointerEvents="none">
      {isLoading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text
            style={[
              styles.label,
              {
                color: getTextColor(),
                fontFamily: typography.fontFamily.semiBold,
                fontSize: getFontSize(),
              },
              textStyle,
            ]}
          >
            {label}
          </Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </>
      )}
    </View>
  );

  if (isPrimary && !disabled) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !!(disabled || isLoading), busy: !!isLoading }}
        onPress={onPress}
        disabled={disabled || isLoading}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        unstable_pressDelay={0}
        style={({ pressed }) => [
          styles.touchable,
          {
            borderRadius: BUTTON_RADIUS,
            opacity: disabled ? 0.6 : pressed ? 0.92 : 1.0,
            transform: [{ scale: !disabled && !isLoading && pressed ? 0.985 : 1.0 }],
          },
          !disabled && primaryShadow,
          style,
        ]}
      >
        <GradientView
          colors={[colors.accentGradientStart, colors.accentGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          borderRadius={BUTTON_RADIUS}
          style={[styles.baseButton, { height: getHeight() }]}
        >
          {content}
        </GradientView>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!(disabled || isLoading), busy: !!isLoading }}
      onPress={onPress}
      disabled={disabled || isLoading}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      unstable_pressDelay={0}
      style={({ pressed }) => [
        styles.touchable,
        styles.baseButton,
        {
          height: getHeight(),
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' || variant === 'secondary' ? 1 : 0,
          borderRadius: BUTTON_RADIUS,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1.0,
          transform: [{ scale: !disabled && !isLoading && pressed ? 0.985 : 1.0 }],
        },
        variant === 'secondary' && shadows.sm,
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
    minHeight: 48,
  },
  baseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
