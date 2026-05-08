import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Typography } from '../../constants/theme';
import { useStore } from '../../store/useStore';
import { ArrowLeft, Edit2 } from 'lucide-react-native';

export default function RecordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { records, updateRecord } = useStore();
  
  const record = records.find(r => r.id === id);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(record?.reportName || '');
  const [notesVal, setNotesVal] = useState(record?.doctorNotes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  if (!record) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Record not found</Text>
      </SafeAreaView>
    );
  }

  const handleNameSave = () => {
    updateRecord(record.id, { reportName: nameVal });
    setIsEditingName(false);
  };

  const handleNotesSave = () => {
    updateRecord(record.id, { doctorNotes: notesVal });
    setIsEditingNotes(false);
  };

  const renderMetadataRow = (label: string, value: string | undefined, isAlt = false) => (
    <View style={[styles.metaRow, isAlt && styles.metaRowAlt]}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value || '--'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        
        {isEditingName ? (
          <TextInput 
            style={styles.nameInput} 
            value={nameVal} 
            onChangeText={setNameVal} 
            onBlur={handleNameSave}
            autoFocus
          />
        ) : (
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{record.reportName}</Text>
            <TouchableOpacity onPress={() => setIsEditingName(true)}>
              <Edit2 size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        
        {/* Metadata Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Report Details</Text>
          </View>
          {renderMetadataRow('Scan Date', record.scanDate)}
          {renderMetadataRow('Scan Time', record.scanTime, true)}
          {renderMetadataRow('Report Date', record.reportDate)}
          {renderMetadataRow('Report Type', record.reportType, true)}
          {renderMetadataRow('Body Part', record.bodyPart)}
          {renderMetadataRow('Condition', record.detectedCondition, true)}
          {renderMetadataRow('Hospital/Lab', record.labHospital)}
          {renderMetadataRow('Referring Dr', record.referringDoctor, true)}
        </View>

        {/* AI Summary Block */}
        {record.aiProcessed && (
          <View style={styles.aiSummaryBlock}>
            <Text style={styles.aiLabel}>AI SUMMARY  🔒</Text>
            <Text style={styles.aiBody}>{record.aiSummary}</Text>
            <Text style={styles.aiNotice}>This summary is AI-generated and cannot be edited</Text>
          </View>
        )}

        {/* Doctor Notes Block */}
        <View style={[styles.notesBlock, isEditingNotes && styles.notesBlockActive]}>
          <View style={styles.notesHeader}>
            <Text style={styles.notesLabel}>YOUR NOTES <Edit2 size={12} color={Colors.primary} /></Text>
          </View>
          <TextInput
            style={styles.notesInput}
            value={notesVal}
            onChangeText={setNotesVal}
            onFocus={() => setIsEditingNotes(true)}
            onBlur={handleNotesSave}
            multiline
            placeholder="Add personal context or doctor advice here..."
            placeholderTextColor={Colors.textDisabled}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryPale },
  errorText: { ...Typography.body, color: Colors.error, textAlign: 'center', marginTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 40, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backButton: { marginRight: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  title: { ...Typography.h2, color: Colors.textPrimary, flexShrink: 1 },
  nameInput: { ...Typography.h2, color: Colors.textPrimary, flex: 1, borderBottomWidth: 1, borderBottomColor: Colors.primary, padding: 0 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  tableContainer: { backgroundColor: Colors.surface, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, marginBottom: 24 },
  tableHeader: { backgroundColor: Colors.dark, padding: 12 },
  tableHeaderText: { ...Typography.small, fontFamily: 'DMSans_600SemiBold', color: Colors.surface, textTransform: 'uppercase' },
  metaRow: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: Colors.border },
  metaRowAlt: { backgroundColor: Colors.primaryPale },
  metaLabel: { ...Typography.small, fontFamily: 'DMSans_500Medium', color: Colors.textSecondary, flex: 1 },
  metaValue: { ...Typography.small, color: Colors.textPrimary, flex: 1.5 },
  aiSummaryBlock: { backgroundColor: Colors.dark, borderRadius: 16, padding: 20, marginBottom: 24 },
  aiLabel: { ...Typography.tiny, color: Colors.primary, fontFamily: 'DMSans_600SemiBold', marginBottom: 12 },
  aiBody: { ...Typography.body, color: Colors.surface, lineHeight: 24 },
  aiNotice: { ...Typography.tiny, color: Colors.textSecondary, marginTop: 16, borderTopWidth: 1, borderTopColor: Colors.textSecondary, paddingTop: 12 },
  notesBlock: { backgroundColor: Colors.surface, borderRadius: 16, padding: 20, borderWidth: 1.5, borderColor: Colors.border, borderStyle: 'dashed' },
  notesBlockActive: { borderColor: Colors.primary, borderStyle: 'solid' },
  notesHeader: { marginBottom: 12 },
  notesLabel: { ...Typography.tiny, color: Colors.primary, fontFamily: 'DMSans_600SemiBold' },
  notesInput: { ...Typography.body, color: Colors.textPrimary, minHeight: 100, textAlignVertical: 'top' },
});
