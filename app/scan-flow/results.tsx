import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../../store/useStore';
import { MedicalRecord, ExtractedValue } from '../../types';

export default function ResultsScreen() {
  const router = useRouter();
  const { recordJson } = useLocalSearchParams<{ recordJson: string }>();

  // Parse the real record generated in the SQLite database by the backend
  const record: MedicalRecord = React.useMemo(() => {
    try {
      return recordJson ? JSON.parse(recordJson) : null;
    } catch (e) {
      console.error('Failed to parse record JSON:', e);
      return null;
    }
  }, [recordJson]);

  const handleSave = async () => {
    console.log('[ResultsScreen] Confirming review. Reloading store and navigating home...');
    
    // Refresh local store with all the database records (including the newly created one)
    await useStore.getState().loadInitialData();
    
    router.dismissAll();
    router.replace('/(tabs)');
  };

  if (!record) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No AI results found. Please scan again.</Text>
      </SafeAreaView>
    );
  }

  // Get status dot color
  const getStatusColor = (status: ExtractedValue['status']) => {
    switch (status) {
      case 'critical':
        return Colors.error;
      case 'warning':
        return Colors.warning;
      case 'normal':
      default:
        return Colors.success;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBanner}>
        <Text style={styles.bannerText}>AI Analysis Complete</Text>
      </View>
      
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        
        {/* Record General Details */}
        <Card style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>{record.reportName}</Text>
          <Text style={styles.detailsSubtitle}>
            {record.reportType} • {record.bodyPart} • {record.labHospital}
          </Text>
        </Card>

        {/* Dynamic Extracted Lab Values */}
        {record.extractedValues && record.extractedValues.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Extracted Values</Text>
            {record.extractedValues.map((val, idx) => (
              <Card key={idx} style={styles.valueCard}>
                <View style={styles.valueHeader}>
                  <View style={styles.nameRow}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(val.status) }]} />
                    <Text style={styles.valueName}>{val.name}</Text>
                  </View>
                  <Text style={styles.valueText}>
                    {val.value} {val.unit ? <Text style={styles.unitText}>{val.unit}</Text> : null}
                  </Text>
                </View>
                {val.referenceRange ? (
                  <Text style={styles.referenceText}>Ref: {val.referenceRange}</Text>
                ) : null}
                {val.historicalDelta ? (
                  <View style={styles.historicalCard}>
                    <Text style={styles.historicalText}>{val.historicalDelta}</Text>
                  </View>
                ) : null}
              </Card>
            ))}
          </>
        )}

        {/* AI Summary Block (Locked 🔒) */}
        <View style={styles.aiSummaryBlock}>
          <Text style={styles.aiLabel}>AI SUMMARY  🔒</Text>
          <Text style={styles.aiBody}>
            {/* Highlight Haemoglobin or important terms visually if CBC */}
            {record.aiSummary}
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
  errorText: { ...Typography.body, color: Colors.error, textAlign: 'center', marginTop: 40 },
  topBanner: { backgroundColor: Colors.dark, padding: 16, alignItems: 'center' },
  bannerText: { ...Typography.body, color: Colors.surface, fontFamily: 'DMSans_600SemiBold' },
  scroll: { flex: 1 },
  content: { padding: 20 },
  detailsCard: { marginBottom: 20, backgroundColor: Colors.surface },
  detailsTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: 4 },
  detailsSubtitle: { ...Typography.small, color: Colors.textSecondary },
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
  aiNotice: { ...Typography.tiny, color: Colors.textSecondary, marginTop: 16, borderTopWidth: 1, borderTopColor: Colors.textSecondary, paddingTop: 12 },
  footer: { padding: 20, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border },
});
