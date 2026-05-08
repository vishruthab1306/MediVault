import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { Button } from '../../components/Button';
import { useRouter } from 'expo-router';
import { Shield } from 'lucide-react-native';

export default function SplashScreen() {
  const router = useRouter();

  const handleGmailSignIn = () => {
    // Mock Gmail Sign In
    // After sign in, go to PIN setup
    router.push('/(auth)/pin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Shield size={48} color={Colors.primary} />
          </View>
          <Text style={styles.appName}>MediVault</Text>
          <Text style={styles.tagline}>Your health. Secured.</Text>
        </View>

        <View style={styles.footer}>
          <Button 
            title="Sign in with Gmail" 
            onPress={handleGmailSignIn}
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  appName: {
    ...Typography.h1,
    color: Colors.surface,
    marginBottom: 8,
  },
  tagline: {
    ...Typography.body,
    color: Colors.primarySoft,
  },
  footer: {
    paddingBottom: 24,
  },
  button: {
    width: '100%',
  },
});
