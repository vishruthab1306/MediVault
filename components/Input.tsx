import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps, ViewStyle } from 'react-native';
import { Colors, Typography } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({ label, containerStyle, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          props.editable === false && styles.inputDisabled
        ]}
        placeholderTextColor={Colors.textDisabled}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    ...Typography.body,
    backgroundColor: Colors.primaryPale,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.textPrimary,
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
  inputDisabled: {
    backgroundColor: Colors.surface,
    color: Colors.textSecondary,
    borderColor: Colors.primaryMuted,
  },
});
