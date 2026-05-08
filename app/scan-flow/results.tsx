import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';

export default function ResultsScreen() {
  const router = useRouter();
  const { addRecord } = useStore();

  const handleSave = () => {
    // Generate mock record
    const newRecord = {
      id: Math.random().toString(),
      reportName: 'CBC Test Jan 2025',
      scanDate: '15/01/2025',
      scanTime: '10:30 AM',
      reportDate: '14/01/2025',
      reportType: 'Lab Result' as const,
      bodyPart: 'Blood / Haematology',
      detectedCondition: 'Routine Checkup',
      labHospital: 'Apollo Diagnostics',
      referringDoctor: 'Dr. Priya Nair',
      patientName: 'John Doe',
      tags: ['Blood', 'Annual'],
      aiProcessed: true,
      cloudSynced: false,
      aiSummary: 'Your Haemoglobin has dropped slightly from 13.2 to 11.8 since your last test. Other indices are within normal ranges. Consider discussing the slight drop with your doctor.',
      doctorNotes: '',
      extractedValues: [
        { name: 'Haemoglobin', value: '11.8', unit: 'g/dL', status: 'warning' as const, referenceRange: '13.0 - 17.0', historicalDelta: 'Dropped from 13.2' },
        { name: 'WBC Count', value: '7500', unit: 'cells/cmm', status: 'normal' as const, referenceRange: '4000 - 11000' },
        { name: 'Platelets', value: '250000', unit: 'cells/cmm', status: 'normal' as const, referenceRange: '150000 - 450000' }
      ]
    };

    addRecord(newRecord);
    router.dismissAll();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBanner}>
        <Text style={styles.bannerText}>AI Analysis Complete</Text>
      </View>
      
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Extracted Values</Text>
        
        {/* Mock Values */}
        <Card style={styles.valueCard}>
          <View style={styles.valueHeader}>
            <View style={styles.nameRow}>
              <View style={[styles.statusDot, { backgroundColor: Colors.warning }]} />
              <Text style={styles.valueName}>Haemoglobin</Text>
            </View>
            <Text style={styles.valueText}>11.8 <Text style={styles.unitText}>g/dL</Text></Text>
          </View>
          <Text style={styles.referenceText}>Ref: 13.0 - 17.0</Text>
          <View style={styles.historicalCard}>
            <Text style={styles.historicalText}>Dropped from 13.2</Text>
          </View>
        </Card>

        <Card style={styles.valueCard}>
          <View style={styles.valueHeader}>
            <View style={styles.nameRow}>
              <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.valueName}>WBC Count</Text>
            </View>
            <Text style={styles.valueText}>7500 <Text style={styles.unitText}>cells/cmm</Text></Text>
          </View>
          <Text style={styles.referenceText}>Ref: 4000 - 11000</Text>
        </Card>

        {/* AI Summary Block (Locked) */}
        <View style={styles.aiSummaryBlock}>
          <Text style={styles.aiLabel}>AI SUMMARY  🔒</Text>
          <Text style={styles.aiBody}>
            Your <Text style={styles.aiHighlight}>Haemoglobin has dropped slightly to 11.8</Text> since your last test. Other indices are within normal ranges. Consider discussing the slight drop with your doctor.
          </Text>
          <Text style={styles.aiNotice}>This summary is AI-generated and cannot be edited</Text>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Button title="Review Metadata & Save" onPress={handleSave} style={{ width: '100%' }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryPale },
  topBanner: { backgroundColor: Colors.dark, padding: 16, alignItems: 'center' },
  bannerText: { ...Typography.body, color: Colors.surface, fontFamily: 'DMSans_600SemiBold' },
  scroll: { flex: 1 },
  content: { padding: 20 },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: 16 },
  valueCard: { marginBottom: 12 },
  valueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  valueName: { ...Typography.body, color: Colors.textPrimary, fontFamily: 'DMSans_500Medium' },
  valueText: { ...Typography.h3, color: Colors.textPrimary },
  unitText: { ...Typography.small, color: Colors.textSecondary },
  referenceText: { ...Typography.tiny, color: Colors.textSecondary, marginLeft: 18 },
  historicalCard: { backgroundColor: Colors.primaryMuted, padding: 8, borderRadius: 6, marginTop: 12, marginLeft: 18 },
  historicalText: { ...Typography.small, color: Colors.primary },
  aiSummaryBlock: { backgroundColor: Colors.dark, borderRadius: 16, padding: 20, marginTop: 24 },
  aiLabel: { ...Typography.tiny, color: Colors.primary, fontFamily: 'DMSans_600SemiBold', marginBottom: 12 },
  aiBody: { ...Typography.body, color: Colors.surface, lineHeight: 24 },
  aiHighlight: { color: Colors.primary, fontFamily: 'DMSans_600SemiBold' },
  aiNotice: { ...Typography.tiny, color: Colors.textSecondary, marginTop: 16, borderTopWidth: 1, borderTopColor: Colors.textSecondary, paddingTop: 12 },
  footer: { padding: 20, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border },
});
