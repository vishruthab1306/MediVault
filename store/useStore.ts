import { create } from 'zustand';
import { AppState, MedicalRecord } from '../types';

// Mock Data
const MOCK_RECORDS: MedicalRecord[] = [
  {
    id: '1',
    reportName: 'CBC Test Jan 2025',
    scanDate: '15/01/2025',
    scanTime: '10:30 AM',
    reportDate: '14/01/2025',
    reportType: 'Lab Result',
    bodyPart: 'Blood / Haematology',
    detectedCondition: 'Routine Checkup',
    labHospital: 'Apollo Diagnostics',
    referringDoctor: 'Dr. Priya Nair',
    patientName: 'John Doe',
    tags: ['Blood', 'Annual'],
    aiProcessed: true,
    cloudSynced: true,
    aiSummary: 'Your Haemoglobin has dropped slightly from 13.2 to 11.8 since your last test. Other indices are within normal ranges. Consider discussing the slight drop with your doctor.',
    doctorNotes: 'Doctor advised iron-rich diet.',
    extractedValues: [
      { name: 'Haemoglobin', value: '11.8', unit: 'g/dL', status: 'warning', referenceRange: '13.0 - 17.0', historicalDelta: 'Dropped from 13.2' },
      { name: 'WBC Count', value: '7500', unit: 'cells/cmm', status: 'normal', referenceRange: '4000 - 11000' },
      { name: 'Platelets', value: '250000', unit: 'cells/cmm', status: 'normal', referenceRange: '150000 - 450000' }
    ]
  },
  {
    id: '2',
    reportName: 'Chest X-Ray',
    scanDate: '10/12/2024',
    scanTime: '02:15 PM',
    reportDate: '10/12/2024',
    reportType: 'Imaging & Scans',
    bodyPart: 'Chest / Pulmonology',
    detectedCondition: 'Cough screening',
    labHospital: 'Manipal Hospitals',
    referringDoctor: 'Dr. Ramesh Iyer',
    patientName: 'John Doe',
    tags: ['X-Ray', 'Chest'],
    aiProcessed: true,
    cloudSynced: true,
    aiSummary: 'No active lung lesions or pleural effusion detected. Normal cardiothymic silhouette.',
    doctorNotes: '',
  }
];

export const useStore = create<AppState>((set) => ({
  isOffline: false,
  isAuthenticated: false,
  profile: {
    name: 'John Doe',
    dob: '12/05/1990',
    gender: 'Male',
    height: '175',
    weight: '70',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Dust'],
    conditions: ['Mild Hypertension'],
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+91 9876543210'
    },
    pin: null
  },
  records: MOCK_RECORDS,
  timeline: [
    {
      id: 't1',
      date: '15/01/2025',
      recordId: '1',
      type: 'Lab Result',
      reportName: 'CBC Test Jan 2025',
      snippet: 'Haemoglobin slightly low (11.8 g/dL).'
    },
    {
      id: 't2',
      date: '10/12/2024',
      recordId: '2',
      type: 'Imaging & Scans',
      reportName: 'Chest X-Ray',
      snippet: 'Normal study. No abnormalities detected.'
    }
  ],

  setOffline: (status) => set({ isOffline: status }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setProfile: (updates) => set((state) => ({ 
    profile: state.profile ? { ...state.profile, ...updates } : null 
  })),
  addRecord: (record) => set((state) => ({ 
    records: [record, ...state.records] 
  })),
  updateRecord: (id, updates) => set((state) => ({
    records: state.records.map(r => r.id === id ? { ...r, ...updates } : r)
  })),
  addTimelineEvent: (event) => set((state) => ({
    timeline: [event, ...state.timeline]
  }))
}));
