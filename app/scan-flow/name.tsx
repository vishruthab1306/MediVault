import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useRouter } from 'expo-router';

export default function NameReportScreen() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleNext = () => {
    // Navigate to process screen
    router.push('/scan-flow/process');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Name Your Report</Text>
          <Text style={styles.subtitle}>What should we call this record?</Text>
        </View>

        <View style={styles.form}>
          <Input 
            placeholder="e.g., Blood Test Dec 2024" 
            value={name}
            onChangeText={setName}
            autoFocus
          />
          <View style={styles.suggestionBox}>
            <Text style={styles.suggestionText}>Suggested: CBC Test Jan 2025 ✨</Text>
            <TouchableOpacity onPress={() => setName('CBC Test Jan 2025')}>
              <Text style={styles.useText}>Use</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Button 
            title="Continue" 
            onPress={handleNext} 
            disabled={name.length === 0}
            style={{ width: '100%' }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryPale },
  content: { flex: 1, padding: 24, justifyContent: 'space-between' },
  header: { marginTop: 40 },
  title: { ...Typography.h1, color: Colors.textPrimary, marginBottom: 8 },
  subtitle: { ...Typography.body, color: Colors.textSecondary },
  form: { flex: 1, marginTop: 40 },
  suggestionBox: {
    backgroundColor: Colors.primaryMuted,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  suggestionText: { ...Typography.small, color: Colors.textPrimary },
  useText: { ...Typography.small, color: Colors.primary, fontFamily: 'DMSans_600SemiBold' },
  footer: { paddingBottom: 20 },
});
