import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { 
  TrendingUp, 
  Briefcase, 
  Calendar, 
  Activity, 
  ArrowLeftRight, 
  Coffee,
  Percent,
  Calculator,
  Clock,
  CreditCard,
  PieChart,
  Tag
} from 'lucide-react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import { CalculatorCategory } from '../../types/calculator';

interface CategoryIconProps {
  category?: CalculatorCategory | string;
  calculatorId?: string;
  size?: number;
  iconSize?: number;
  style?: ViewStyle;
}

export function getCategoryColor(category: string | undefined, colors: any): string {
  switch (category) {
    case 'finance':
      return colors.categoryFinance;
    case 'business':
      return colors.categoryBusiness;
    case 'dailyLife':
      return colors.categoryDailyLife;
    case 'dateTime':
      return colors.categoryDateTime;
    case 'health':
      return colors.categoryHealth;
    case 'converters':
      return colors.categoryConverters;
    default:
      return colors.primary;
  }
}

export const CategoryIcon = React.memo(function CategoryIcon({
  category,
  calculatorId,
  size = 44,
  iconSize = 22,
  style,
}: CategoryIconProps) {
  const { colors, radius } = useAppTheme();
  const themeColor = getCategoryColor(category, colors);

  const renderIcon = () => {
    // Specific calculator icons
    if (calculatorId) {
      if (calculatorId.includes('normal') || calculatorId.includes('basic')) {
        return <Calculator size={iconSize} color={themeColor} />;
      }
      if (calculatorId.includes('emi') || calculatorId.includes('loan')) {
        return <CreditCard size={iconSize} color={themeColor} />;
      }
      if (calculatorId.includes('gst')) {
        return <Percent size={iconSize} color={themeColor} />;
      }
      if (calculatorId.includes('sip') || calculatorId.includes('investment') || calculatorId.includes('roi')) {
        return <TrendingUp size={iconSize} color={themeColor} />;
      }
      if (calculatorId.includes('discount') || calculatorId.includes('markup') || calculatorId.includes('margin')) {
        return <Tag size={iconSize} color={themeColor} />;
      }
      if (calculatorId.includes('age') || calculatorId.includes('date') || calculatorId.includes('days')) {
        return <Calendar size={iconSize} color={themeColor} />;
      }
      if (calculatorId.includes('countdown') || calculatorId.includes('time')) {
        return <Clock size={iconSize} color={themeColor} />;
      }
      if (calculatorId.includes('bmi') || calculatorId.includes('bmr') || calculatorId.includes('calorie')) {
        return <Activity size={iconSize} color={themeColor} />;
      }
      if (calculatorId.includes('converter') || calculatorId.includes('length') || calculatorId.includes('weight')) {
        return <ArrowLeftRight size={iconSize} color={themeColor} />;
      }
      if (calculatorId.includes('split') || calculatorId.includes('profit')) {
        return <PieChart size={iconSize} color={themeColor} />;
      }
    }

    // Category fallbacks
    switch (category) {
      case 'finance':
        return <TrendingUp size={iconSize} color={themeColor} />;
      case 'business':
        return <Briefcase size={iconSize} color={themeColor} />;
      case 'dailyLife':
        return <Coffee size={iconSize} color={themeColor} />;
      case 'dateTime':
        return <Calendar size={iconSize} color={themeColor} />;
      case 'health':
        return <Activity size={iconSize} color={themeColor} />;
      case 'converters':
        return <ArrowLeftRight size={iconSize} color={themeColor} />;
      default:
        return <Calculator size={iconSize} color={themeColor} />;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius.md,
          backgroundColor: `${themeColor}18`, // 10% opacity tint
          borderColor: `${themeColor}33`,     // 20% opacity border
        },
        style,
      ]}
    >
      {renderIcon()}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
