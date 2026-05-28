import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Colors, Typography, useColors } from '../../constants/theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../../store/useStore';
import { Eye } from 'lucide-react-native';

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
Patient Name: Ms. VISHRUTHA BANGLE   Age/Gender: 19 Y 2 M 12 D / F
Reported Date: 27/Mar/2025   Ref Doctor: Dr. Bhavya H S
Lab: Apollo Diagnostics

DEPARTMENT OF HAEMATOLOGY
Test Name: COMPLETE BLOOD COUNT (CBC), WHOLE BLOOD EDTA
HAEMOGLOBIN: 14.2 g/dL   (Bio. Ref. Interval: 12-15)
RBC COUNT: 5.3 Million/cu.mm   (Bio. Ref. Interval: 3.8-4.8)  [WARNING - HIGH]
TOTAL LEUCOCYTE COUNT (TLC): 7,830 cells/cu.mm   (Bio. Ref. Interval: 4000-10000)
PLATELET COUNT: 326000 cells/cu.mm   (Bio. Ref. Interval: 150000-410000)

Clinical Note: Normal Haemoglobin. Dr. Bhavya H S.`,

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
  const { template, capturedImageUri, capturedImageBase64 } = useLocalSearchParams<{ 
    template: string;
    capturedImageUri?: string;
    capturedImageBase64?: string;
  }>();
  const router = useRouter();
  const colors = useColors();
  const theme = useStore((state) => state.theme);

  const getSuggestion = () => {
    if (capturedImageUri) {
      const now = new Date();
      return `Scanned Report ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    }
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

  const getInitialText = () => {
    if (capturedImageUri) {
      return `[CAMERA CAPTURED MEDICAL REPORT]
Image Size: High Resolution JPEG
Gemini Multimodal OCR will read the text directly from the photo you just took!`;
    }
    return DEFAULT_TRANSCRIPTIONS[template || 'cbc'] || '';
  };

  const suggestion = getSuggestion();
  const [name, setName] = useState('');
  const [reportText, setReportText] = useState(getInitialText());

  const handleNext = () => {
    // Navigate to process screen, passing the name, template, the OCR text and the image base64
    router.push({
      pathname: '/scan-flow/process',
      params: { 
        name: name || suggestion, 
        template, 
        reportText,
        capturedImageBase64: capturedImageBase64 || '',
        capturedImageUri: capturedImageUri || ''
      }
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

          {/* Captured Photo Preview Card */}
          {capturedImageUri && (
            <View style={[styles.previewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.previewHeader}>
                <Eye size={16} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.previewTitle, { color: colors.textPrimary }]}>Captured Document Preview</Text>
              </View>
              
              <View style={styles.previewBody}>
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: capturedImageUri }} style={styles.imageThumbnail} resizeMode="cover" />
                  <View style={styles.imageDetails}>
                    <Text style={[styles.imageName, { color: colors.textPrimary }]} numberOfLines={1}>
                      {name || suggestion || 'captured_report.jpg'}
                    </Text>
                    <Text style={{ ...Typography.tiny, color: colors.textSecondary }}>Live Camera Photo</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

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

  // Multimodal Preview Styles
  previewCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    marginTop: 20,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewTitle: {
    ...Typography.small,
    fontFamily: 'DMSans_700Bold',
  },
  previewBody: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  imageThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  imageDetails: {
    marginLeft: 16,
    flex: 1,
  },
  imageName: {
    ...Typography.body,
    fontFamily: 'DMSans_700Bold',
  },
});
