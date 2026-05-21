import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, ActivityIndicator, Alert, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { useStore } from '../../store/useStore';
import { useRouter } from 'expo-router';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { api } from '../../services/api';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { setAuthenticated } = useStore();
  const router = useRouter();

  const handleAuth = async () => {
    setValidationError('');
    
    // Simple validation
    if (!email || !email.includes('@')) {
      setValidationError('Please enter a valid Gmail address.');
      return;
    }
    if (!password || password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        // Registration flow
        console.log('[AuthScreen] Registering user...');
        await api.registerUser(email, password);
        
        // Auto-login upon successful registration
        console.log('[AuthScreen] Auto-logging in user...');
        const response = await api.loginUser(email, password);
        if (response.authenticated) {
          await useStore.getState().loadInitialData();
          setAuthenticated(true);
          router.replace('/(tabs)');
        }
      } else {
        // Login flow
        console.log('[AuthScreen] Logging in user...');
        const response = await api.loginUser(email, password);
        if (response.authenticated) {
          await useStore.getState().loadInitialData();
          setAuthenticated(true);
          router.replace('/(tabs)');
        }
      }
    } catch (error: any) {
      console.error('[AuthScreen Error]:', error.message);
      Alert.alert(
        isRegister ? 'Registration Failed' : 'Login Failed',
        error.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Shield size={48} color={Colors.primary} />
            </View>
            <Text style={styles.appName}>MediVault</Text>
            <Text style={styles.tagline}>Your medical data. Highly secured.</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>
              {isRegister ? 'Create Secure Account' : 'Welcome Back'}
            </Text>
            <Text style={styles.formSubtitle}>
              {isRegister 
                ? 'Enter details to start securing your medical baseline.' 
                : 'Enter your credentials to access your health vault.'}
            </Text>

            {validationError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{validationError}</Text>
              </View>
            ) : null}

            {/* Email Field */}
            <Text style={styles.label}>Gmail Address</Text>
            <View style={styles.inputWrapper}>
              <Mail size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="example@gmail.com"
                placeholderTextColor={Colors.textSecondary}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setValidationError('');
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Password Field */}
            <Text style={styles.label}>Security Password</Text>
            <View style={styles.inputWrapper}>
              <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { paddingRight: 48 }]}
                placeholder="At least 6 characters"
                placeholderTextColor={Colors.textSecondary}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setValidationError('');
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeButton} 
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword 
                  ? <EyeOff size={20} color={Colors.textSecondary} /> 
                  : <Eye size={20} color={Colors.textSecondary} />
                }
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.surface} />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isRegister ? 'Register & Set Profile' : 'Access Vault'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle State */}
            <TouchableOpacity 
              style={styles.toggleButton} 
              onPress={() => {
                setIsRegister(!isRegister);
                setValidationError('');
              }}
              disabled={loading}
            >
              <Text style={styles.toggleText}>
                {isRegister 
                  ? 'Already registered? Sign In' 
                  : 'New to MediVault? Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  appName: {
    ...Typography.h1,
    color: Colors.surface,
    marginBottom: 6,
  },
  tagline: {
    ...Typography.body,
    color: Colors.primarySoft,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  formTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  formSubtitle: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: Colors.primaryPale,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
    marginBottom: 16,
  },
  errorText: {
    ...Typography.small,
    color: Colors.primary,
    fontFamily: 'DMSans_600SemiBold',
    textAlign: 'center',
  },
  label: {
    ...Typography.small,
    color: Colors.textPrimary,
    fontFamily: 'DMSans_600SemiBold',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryPale,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    position: 'relative',
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    color: Colors.textPrimary,
    ...Typography.body,
    paddingRight: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    height: 56,
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    ...Typography.body,
    fontFamily: 'DMSans_700Bold',
    color: Colors.surface,
  },
  toggleButton: {
    alignSelf: 'center',
    marginTop: 20,
    padding: 8,
  },
  toggleText: {
    ...Typography.small,
    color: Colors.primary,
    fontFamily: 'DMSans_600SemiBold',
  },
});
