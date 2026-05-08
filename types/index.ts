export type RecordType = 'Lab Result' | 'Imaging & Scans' | 'Medical History' | 'Documents';

export interface MedicalRecord {
  id: string;
  reportName: string;
  scanDate: string; // DD/MM/YYYY
  scanTime: string; // HH:MM AM/PM
  reportDate: string; // DD/MM/YYYY
  reportType: RecordType;
  bodyPart: string;
  detectedCondition: string;
  labHospital: string;
  referringDoctor: string;
  patientName: string;
  tags: string[];
  aiProcessed: boolean;
  cloudSynced: boolean;
  aiSummary: string; // Locked
  doctorNotes: string; // Editable
  extractedValues?: ExtractedValue[];
}

export interface ExtractedValue {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  referenceRange: string;
  historicalDelta?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  recordId: string;
  type: RecordType;
  reportName: string;
  snippet: string;
  conditionCluster?: string;
}

export interface UserProfile {
  name: string;
  dob: string;
  gender: string;
  height: string;
  weight: string;
  bloodType: string;
  allergies: string[];
  conditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
  };
  pin: string | null;
}

export interface AppState {
  isOffline: boolean;
  isAuthenticated: boolean;
  profile: UserProfile | null;
  records: MedicalRecord[];
  timeline: TimelineEvent[];
  
  // Actions
  setOffline: (status: boolean) => void;
  setAuthenticated: (status: boolean) => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  addRecord: (record: MedicalRecord) => void;
  updateRecord: (id: string, updates: Partial<MedicalRecord>) => void;
  addTimelineEvent: (event: TimelineEvent) => void;
}
