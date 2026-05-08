import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProcessScreen() {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Mock processing delay
    const timer = setTimeout(() => {
      router.push('/scan-flow/results');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconCircle, { transform: [{ scale: pulseAnim }] }]}>
        <FileText size={48} color={Colors.surface} />
      </Animated.View>
      <Text style={styles.statusText}>Reading your report...</Text>
      <Text style={styles.subText}>AI is analyzing the contents</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark, justifyContent: 'center', alignItems: 'center' },
  iconCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 40,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20, elevation: 10,
  },
  statusText: { ...Typography.h3, color: Colors.surface, marginBottom: 8 },
  subText: { ...Typography.small, color: Colors.primarySoft },
});
