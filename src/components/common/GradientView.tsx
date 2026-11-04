import React, { useId } from 'react';
import { View, ViewProps, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

export interface GradientViewProps extends ViewProps {
  colors: [string, string, ...string[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function GradientView({
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
  borderRadius,
  style,
  children,
  ...props
}: GradientViewProps) {
  const rawId = useId();
  const gradientId = `grad-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;

  const x1 = `${start.x * 100}%`;
  const y1 = `${start.y * 100}%`;
  const x2 = `${end.x * 100}%`;
  const y2 = `${end.y * 100}%`;

  return (
    <View
      style={[
        styles.container,
        borderRadius !== undefined && { borderRadius, overflow: 'hidden' },
        style,
      ]}
      {...props}
    >
      <View 
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { overflow: 'hidden', borderRadius: borderRadius || 0 }]}
      >
        <Svg height="100%" width="100%" pointerEvents="none">
          <Defs>
            <LinearGradient id={gradientId} x1={x1} y1={y1} x2={x2} y2={y2}>
              {colors.map((color, idx) => {
                const offset = idx === 0 ? '0%' : idx === colors.length - 1 ? '100%' : `${(idx / (colors.length - 1)) * 100}%`;
                return <Stop key={idx} offset={offset} stopColor={color} stopOpacity="1" />;
              })}
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId})`} />
        </Svg>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});
