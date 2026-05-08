import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography } from '../constants/theme';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'ai' | 'pending';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default', style }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { bg: '#E8F5EE', text: Colors.success };
      case 'warning':
        return { bg: '#FFF8E7', text: Colors.warning };
      case 'error':
        return { bg: '#FFEBEB', text: Colors.error };
      case 'ai':
        return { bg: Colors.dark, text: Colors.surface };
      case 'pending':
        return { bg: Colors.primaryMuted, text: Colors.primarySoft };
      case 'default':
      default:
        return { bg: Colors.primaryMuted, text: Colors.primary };
    }
  };

  const stylesForVariant = getVariantStyles();

  return (
    <View style={[styles.container, { backgroundColor: stylesForVariant.bg }, style]}>
      <Text style={[styles.text, { color: stylesForVariant.text }]}>{label.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.tiny,
    fontFamily: 'DMSans_500Medium',
    letterSpacing: 0.3,
  },
});
