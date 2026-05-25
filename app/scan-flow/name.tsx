import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Colors, Typography, useColors } from '../../constants/theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../../store/useStore';

const DEFAULT_TRANSCRIPTIONS: Record<string, string> = {
  evergreen: `Evergreen Wellness Hospital
123 Harmony Street Sunnyville, CA 90210 USA

MEDICAL REPORT
Visit Info
Doctor's Name: Dr. Olivia Greene   Visit Date: 14.11.2023
Specialization: Cardiology

Patient Info
Full Name: Sarah Anderson   Birth Date: 01.01.1989
Med. Number: MA567891       IHI: 5556-9669-9654-7788
Phone: +1 (555) 789-0123   Email: s.anderson@mail.com

Assessment
Ms. Anderson appears in good health with no immediate concerns during the examination.
Based on the assessment, there are no significant issues detected, and vital signs are within normal ranges.

Diagnosis
After thorough examination, no specific medical conditions or acute illnesses were identified.
The diagnosis indicates a healthy status with no evidence of underlying health issues.

Prescription
No prescription is necessary at this time.`,

  general: `GENERAL CHECK-UP REPORT
PATIENT DETAILS
Name: Jane Doe      DOB: 50
Age: 1975-04-30     Gender: Female

MEDICAL HISTORY
Hypertension, start 2015
Surgeries: Appendectomy
Allergies: No known allergies

VITALS
Blood pressure 140/85 mmHg   Pulse: 76 bpm
Temperature 36.8 °C          Respiratory rt: 16 / min

DOCTOR'S OBSERVATIONS
Alert, and in no distress
Regular heart sounds

NOTES AND NEXT STEPS
Continuation of hydrochlorothiazide/25 mg, daily.
Dr. A. Smith        2025-06-22`,

  cbc: `Apollo Diagnostics
Complete Blood Count (CBC) Report
Patient: John Doe    Age: 42    Gender: Male
Date: 12/01/2026     Dr. Priya Nair

HAEMATOLOGY RESULTS:
Haemoglobin: 11.8 g/dL   (Ref: 13.0 - 17.0 g/dL)  [WARNING - LOW]
WBC Count: 7500 /cmm     (Ref: 4000 - 11000 /cmm)
Platelets: 250000 /cmm   (Ref: 150000 - 450000 /cmm)

Clinical Note: Mild microcytic anemia suspected. Dr. Priya Nair.`,

  sugar: `Manipal Hospitals
Blood Glucose Lab Results
Patient: John Doe    Age: 56    Gender: Male
Date: 10/01/2026     Dr. Ramesh Iyer

TEST PARAMETERS:
Fasting Blood Glucose: 145 mg/dL   (Ref: 70 - 100 mg/dL)  [CRITICAL - HIGH]
HbA1c: 7.2 %                       (Ref: 4.0 - 5.6 %)     [WARNING - HIGH]

Clinical Note: Poor glycemic control. Discuss with Dr. Ramesh Iyer.`,

  bp: `Max Super Speciality Hospital
Blood Pressure Record
Patient: John Doe    Age: 61    Gender: Male
Date: 15/01/2026     Dr. Suresh Sharma

VITALS LOG:
Systolic BP: 135 mmHg   (Ref: < 120 mmHg)  [WARNING]
Diastolic BP: 85 mmHg   (Ref: < 80 mmHg)   [WARNING]
Pulse Rate: 74 bpm      (Ref: 60 - 100 bpm)

Clinical Note: Pre-hypertension. Limit sodium. Dr. Suresh Sharma.`,

  thyroid: `SRL Diagnostics
Thyroid Profile Report
Patient: John Doe    Age: 38    Gender: Male
Date: 18/01/2026     Dr. Ananya Rao

RESULTS:
TSH: 5.8 uIU/mL      (Ref: 0.4 - 4.5 uIU/mL) [WARNING - HIGH]
Free T4: 1.2 ng/dL   (Ref: 0.8 - 1.8 ng/dL)

Clinical Note: Subclinical hypothyroidism. Dr. Ananya Rao.`,

  lipid: `Thyrocare Technologies
Lipid Panel Lab Report
Patient: John Doe    Age: 49    Gender: Male
Date: 20/01/2026     Dr. Suresh Sharma

CHOLESTEROL PANEL:
Total Cholesterol: 230 mg/dL (Ref: < 200 mg/dL) [WARNING]
LDL Cholesterol: 145 mg/dL   (Ref: < 100 mg/dL) [WARNING]
HDL Cholesterol: 48 mg/dL    (Ref: > 40 mg/dL)

Clinical Note: Hyperlipidemia. Limit fatty food. Dr. Suresh Sharma.`,

  xray: `Fortis Healthcare
Chest X-Ray Report
Patient: John Doe    Age: 45    Gender: Male
Date: 22/01/2026     Dr. Vikram Seth

IMAGING FINDINGS:
Chest PA View: Clear lung fields. Normal cardiomegaly silhouette.
Rib structures appear fully intact and healthy.
No active lung lesions or pleural effusion detected.

Clinical Note: Healthy normal lungs. Dr. Vikram Seth.`
};

export default function NameReportScreen() {
  const { template } = useLocalSearchParams<{ template: string }>();
  const router = useRouter();
  const colors = useColors();
  const theme = useStore((state) => state.theme);

  const getSuggestion = () => {
    switch (template) {
      case 'evergreen':
        return 'Evergreen Wellness Hospital Report';
      case 'general':
        return 'General Medical Check-up Report';
      case 'sugar':
        return 'Manipal Diabetes Report Jan 2026';
      case 'thyroid':
        return 'SRL Thyroid Profile Feb 2026';
      case 'lipid':
        return 'Thyrocare Lipid Panel Jan 2026';
      case 'xray':
        return 'Fortis Chest X-Ray Mar 2026';
      case 'cbc':
      default:
        return 'Apollo CBC Blood Report Jan 2026';
    }
  };

  const suggestion = getSuggestion();
  const [name, setName] = useState('');
  const [reportText, setReportText] = useState(DEFAULT_TRANSCRIPTIONS[template || 'cbc'] || '');

  const handleNext = () => {
    // Navigate to process screen, passing the name, template and the custom OCR text
    router.push({
      pathname: '/scan-flow/process',
      params: { name: name || suggestion, template, reportText }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primaryPale }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>OCR Transcription Sandbox</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Verify or edit the transcribed text before committing to analysis:
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={[styles.fieldLabel, { color: colors.primary }]}>REPORT FILENAME</Text>
            <Input 
              placeholder={`e.g., ${suggestion}`} 
              value={name}
              onChangeText={setName}
            />
            <View style={[styles.suggestionBox, { backgroundColor: colors.primaryMuted }]}>
              <Text style={[styles.suggestionText, { color: colors.textPrimary }]}>Suggested: {suggestion} ✨</Text>
              <TouchableOpacity onPress={() => setName(suggestion)}>
                <Text style={[styles.useText, { color: colors.primary }]}>Use</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.fieldLabel, { color: colors.primary, marginTop: 24 }]}>
              SCANNED DOCUMENT TEXT (OCR ENGINE OUTPUT)
            </Text>
            <TextInput
              style={[
                styles.ocrInput, 
                { 
                  backgroundColor: colors.surface, 
                  borderColor: colors.border,
                  color: colors.textPrimary
                }
              ]}
              value={reportText}
              onChangeText={setReportText}
              multiline
              numberOfLines={12}
              textAlignVertical="top"
              placeholder="Scanned report text transcription..."
            />
            <Text style={[styles.helpText, { color: colors.textSecondary }]}>
              💡 Tip: Edit the name in "Full Name" or vital values to test E2E dynamic patient matching and vital syncing!
            </Text>
          </View>

          <View style={styles.footer}>
            <Button 
              title="Continue to AI Extraction" 
              onPress={handleNext} 
              style={{ width: '100%' }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  header: { marginTop: 20 },
  title: { ...Typography.h2, marginBottom: 8 },
  subtitle: { ...Typography.body },
  form: { marginTop: 24 },
  fieldLabel: { ...Typography.tiny, fontFamily: 'DMSans_700Bold', marginBottom: 8, letterSpacing: 1 },
  suggestionBox: {
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  suggestionText: { ...Typography.small },
  useText: { ...Typography.small, fontFamily: 'DMSans_600SemiBold' },
  ocrInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    ...Typography.body,
    minHeight: 280,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 13,
    lineHeight: 18,
  },
  helpText: { ...Typography.tiny, marginTop: 8, fontStyle: 'italic', lineHeight: 15 },
  footer: { marginTop: 32 },
});
