import { baseColors } from './colors';
import { ThemeType } from './lightTheme';

export const darkTheme: ThemeType = {
  mode: 'dark',
  colors: {
    // Backgrounds - Deep navy & elevated cards per design direction
    background: baseColors.navy.background,            // #071923
    surface: baseColors.navy.surface,                  // #102B40
    surfaceElevated: baseColors.navy.surfaceElevated,  // #163957
    surfaceHighlight: baseColors.navy.surfaceHighlight,// #1F476B
    
    // Text - Crisp white & muted blue-grey
    text: baseColors.white,
    textSecondary: '#8EACC2', // Muted blue-grey for subtext
    textDisabled: '#43617D',
    textInverse: '#071923',
    white: baseColors.white,
    black: baseColors.black,
    
    // Brand - Keep existing brand identity blue #0056D2 / #0066EE
    primary: '#0066EE',
    primaryDark: baseColors.blue[700],
    primaryLight: '#388EFF',

    // Primary Action Gradient (Orange-Red vibrant gradient)
    accentGradientStart: baseColors.gradient.primaryStart, // #FF6B00
    accentGradientEnd: baseColors.gradient.primaryEnd,     // #FF3838
    accent: '#FF5722',
    accentText: '#FFFFFF',
    
    // UI Elements
    border: baseColors.navy.border,                    // #1A405F
    borderSubtle: baseColors.navy.borderSubtle,        // #14344E
    divider: '#14344E',
    inputBackground: baseColors.navy.inputBackground,  // #0B2233
    inputBorder: baseColors.navy.inputBorder,          // #1F476B
    inputFocusBorder: baseColors.gradient.primaryStart,
    
    // Category Colors
    categoryFinance: baseColors.categories.finance,
    categoryBusiness: baseColors.categories.business,
    categoryDailyLife: baseColors.categories.dailyLife,
    categoryDateTime: baseColors.categories.dateTime,
    categoryHealth: baseColors.categories.health,
    categoryConverters: baseColors.categories.converters,

    // Status
    success: baseColors.success,
    error: baseColors.error,
    warning: baseColors.warning,
    info: baseColors.info,
  }
};
