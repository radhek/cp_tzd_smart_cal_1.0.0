import { baseColors } from './colors';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceHighlight: string;
  text: string;
  textSecondary: string;
  textDisabled: string;
  textInverse: string;
  white: string;
  black: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accentGradientStart: string;
  accentGradientEnd: string;
  accent: string;
  accentText: string;
  border: string;
  borderSubtle: string;
  divider: string;
  inputBackground: string;
  inputBorder: string;
  inputFocusBorder: string;
  categoryFinance: string;
  categoryBusiness: string;
  categoryDailyLife: string;
  categoryDateTime: string;
  categoryHealth: string;
  categoryConverters: string;
  success: string;
  error: string;
  warning: string;
  info: string;
}

export interface ThemeType {
  mode: 'light' | 'dark';
  colors: ThemeColors;
}

export const lightTheme: ThemeType = {
  mode: 'light',
  colors: {
    // Backgrounds
    background: '#F4F7FB',
    surface: '#FFFFFF',
    surfaceElevated: '#F8FAFD',
    surfaceHighlight: '#EBF4FF',
    
    // Text
    text: '#0D1E2C',
    textSecondary: '#5A6E82',
    textDisabled: '#94A3B8',
    textInverse: '#FFFFFF',
    white: baseColors.white,
    black: baseColors.black,
    
    // Brand
    primary: baseColors.blue[500], // #0056D2
    primaryDark: baseColors.blue[700],
    primaryLight: baseColors.blue[500], // #0056D2 (high-contrast primary blue for icons, values & text)

    // Primary Action Gradient (Orange-Red)
    accentGradientStart: baseColors.gradient.primaryStart,
    accentGradientEnd: baseColors.gradient.primaryEnd,
    accent: '#FF5722',
    accentText: '#FFFFFF',
    
    // UI Elements
    border: '#E2E8F0',
    borderSubtle: '#EDF2F7',
    divider: '#E2E8F0',
    inputBackground: '#FFFFFF',
    inputBorder: '#CBD5E1',
    inputFocusBorder: baseColors.blue[500],
    
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
