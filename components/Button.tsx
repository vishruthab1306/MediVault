import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, Shadows, Typography } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'disabled';
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  style,
  textStyle,
  icon
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'primary':
        return [styles.container, styles.primaryContainer];
      case 'secondary':
        return [styles.container, styles.secondaryContainer];
      case 'ghost':
        return [styles.container, styles.ghostContainer];
      case 'disabled':
        return [styles.container, styles.disabledContainer];
      default:
        return [styles.container, styles.primaryContainer];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return [styles.text, styles.primaryText];
      case 'secondary':
        return [styles.text, styles.secondaryText];
      case 'ghost':
        return [styles.text, styles.ghostText];
      case 'disabled':
        return [styles.text, styles.disabledText];
      default:
        return [styles.text, styles.primaryText];
    }
  };

  return (
    <TouchableOpacity
      style={[getContainerStyle(), style]}
      onPress={onPress}
      disabled={variant === 'disabled' || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.surface : Colors.primary} />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  text: {
    ...Typography.body,
    fontFamily: 'DMSans_600SemiBold',
  },
  primaryContainer: {
    backgroundColor: Colors.primary,
    ...Shadows.button,
  },
  primaryText: {
    color: Colors.textOnPrimary,
  },
  secondaryContainer: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  secondaryText: {
    color: Colors.primary,
  },
  ghostContainer: {
    backgroundColor: Colors.primaryMuted,
  },
  ghostText: {
    color: Colors.primary,
  },
  disabledContainer: {
    backgroundColor: Colors.primaryMuted,
  },
  disabledText: {
    color: Colors.textDisabled,
  },
});
