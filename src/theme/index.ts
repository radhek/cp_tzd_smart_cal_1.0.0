import { lightTheme, ThemeType, ThemeColors } from './lightTheme';
import { darkTheme } from './darkTheme';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadows } from './shadows';
import { baseColors } from './colors';

export const theme = {
  light: lightTheme,
  dark: darkTheme,
  typography,
  spacing,
  radius,
  shadows,
  baseColors,
};

export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Radius = typeof radius;
export type Shadows = typeof shadows;

export { lightTheme, darkTheme, typography, spacing, radius, shadows, baseColors };
export type { ThemeType, ThemeColors };
