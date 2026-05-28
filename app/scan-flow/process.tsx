import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Alert } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { FileText } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { api } from '../../services/api';

export default function ProcessScreen() {
  const router = useRouter();
  const { name, template, reportText, capturedImageBase64, capturedImageUri } = useLocalSearchParams<{ 
    name: string; 
    template: string; 
    reportText: string;
    capturedImageBase64?: string;
    capturedImageUri?: string;
  }>();
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

    // Make the real backend API call to process scanning & AI extraction
    const processScannedReport = async () => {
      try {
        console.log(`[ProcessScreen] Sending report "${name}" with captured image base64 data to backend AI engine...`);
        
        const newRecord = await api.createRecord({
          reportName: name || 'Scanned Medical Report',
          templateId: template || 'cbc',
          reportText: reportText || '',
          imageBase64: capturedImageBase64 || '',
          customFileUri: capturedImageUri || '',
        });

        console.log('[ProcessScreen] AI processing complete. Navigating to results page.');
        
        // Pass the created record object to results screen
        router.replace({
          pathname: '/scan-flow/results',
          params: { recordJson: JSON.stringify(newRecord) }
        });
      } catch (error: any) {
        console.error('[ProcessScreen] AI processing failed:', error);
        Alert.alert(
          '⚠️ AI Analysis Offline',
          error.message || 'Could not connect to the medical AI server. The report could not be created.',
          [
            {
              text: 'Go Back',
              onPress: () => router.back()
            }
          ]
        );
      }
    };

    // Trigger after a tiny delay so the gorgeous animation is visible
    const timer = setTimeout(() => {
      processScannedReport();
    }, 1200);

    return () => clearTimeout(timer);
  }, [name]);

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
