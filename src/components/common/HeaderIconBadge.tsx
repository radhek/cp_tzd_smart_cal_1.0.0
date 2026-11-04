import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { 
  Calculator, 
  History, 
  Bookmark, 
  Compass, 
  Settings, 
  Star 
} from 'lucide-react-native';
import { useAppTheme } from '../../theme/useAppTheme';

export type HeaderIconType = 
  | 'calculator' 
  | 'history' 
  | 'bookmark' 
  | 'saved' 
  | 'compass' 
  | 'explore' 
  | 'settings' 
  | 'star';

export interface HeaderIconBadgeProps {
  name?: HeaderIconType;
  icon?: React.ReactNode;
  size?: number;       // Badge container width & height, default 42
  iconSize?: number;   // Icon dimensions, default 22
  color?: string;      // Override icon color
  style?: ViewStyle;
}

export const HeaderIconBadge = React.memo(function HeaderIconBadge({
  name = 'calculator',
  icon,
  size = 42,
  iconSize = 22,
  color,
  style,
}: HeaderIconBadgeProps) {
  const { isDarkMode } = useAppTheme();

  // Consistent Smart Calculator blue: #0056D2 for Light theme, #5C99FF for Dark theme
  const defaultIconColor = isDarkMode ? '#5C99FF' : '#0056D2';
  const effectiveIconColor = color || defaultIconColor;

  const renderIcon = () => {
    if (icon) {
      return icon;
    }

    switch (name) {
      case 'history':
        return <History size={iconSize} color={effectiveIconColor} strokeWidth={2.2} />;
      case 'bookmark':
      case 'saved':
        return <Bookmark size={iconSize} color={effectiveIconColor} strokeWidth={2.2} />;
      case 'compass':
      case 'explore':
        return <Compass size={iconSize} color={effectiveIconColor} strokeWidth={2.2} />;
      case 'settings':
        return <Settings size={iconSize} color={effectiveIconColor} strokeWidth={2.2} />;
      case 'star':
        return <Star size={iconSize} color={effectiveIconColor} strokeWidth={2.2} />;
      case 'calculator':
      default:
        return <Calculator size={iconSize} color={effectiveIconColor} strokeWidth={2.2} />;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: 12,
          backgroundColor: isDarkMode ? 'rgba(0, 86, 210, 0.25)' : '#EBF4FF',
          borderColor: isDarkMode ? 'rgba(92, 153, 255, 0.45)' : '#D6E8FF',
          borderWidth: 1,
        },
        style,
      ]}
    >
      {renderIcon()}
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
