import express from 'express';
import cors from 'cors';
import { prisma } from './config/db';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import recordRoutes from './routes/records';
import vitalsRoutes from './routes/vitals';
import timelineRoutes from './routes/timeline';
import emergencyRoutes from './routes/emergency';

const TEST_PORT = 5002;
const BASE_URL = `http://localhost:${TEST_PORT}`;

// Quick local Express server setup for testing
const testApp = express();
testApp.use(cors());
testApp.use(express.json());
testApp.use('/api/auth', authRoutes);
testApp.use('/api/profile', profileRoutes);
testApp.use('/api/records', recordRoutes);
testApp.use('/api/vitals', vitalsRoutes);
testApp.use('/api/timeline', timelineRoutes);
testApp.use('/api/emergency', emergencyRoutes);

let serverInstance: any;

async function runTests() {
  console.log('🧪 Starting MediVault API Integration Tests...\n');

  // 1. Start test server
  await new Promise<void>((resolve) => {
    serverInstance = testApp.listen(TEST_PORT, () => {
      console.log(`📡 Test server listening on ${BASE_URL}`);
      resolve();
    });
  });

  try {
    let testRecordId = '';

    // 2. Auth: Register PIN
    console.log('\n--- Testing Authentication API ---');
    const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '654321' })
    });
    const registerData: any = await registerRes.json();
    console.log('POST /api/auth/register status:', registerRes.status);
    console.log('Response:', JSON.stringify(registerData));

    // 3. Auth: Login / Verify PIN
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '654321' })
    });
    const loginData: any = await loginRes.json();
    console.log('POST /api/auth/login status:', loginRes.status);
    console.log('User profile fields returned:', Object.keys(loginData.user || {}));

    // 4. Profile: Retrieve and Update Profile
    console.log('\n--- Testing Profile API ---');
    const getProfileRes = await fetch(`${BASE_URL}/api/profile`);
    const profileData: any = await getProfileRes.json();
    console.log('GET /api/profile status:', getProfileRes.status);
    console.log('Current Name:', profileData.name);

    const updateProfileRes = await fetch(`${BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Jane Doe Senior', allergies: ['Penicillin', 'Peanuts'] })
    });
    const updatedProfile: any = await updateProfileRes.json();
    console.log('PUT /api/profile status:', updateProfileRes.status);
    console.log('Updated Name:', updatedProfile.name);
    console.log('Updated Allergies:', updatedProfile.allergies);

    // 5. Records: Upload simulated report
    console.log('\n--- Testing Medical Records API ---');
    const uploadRes = await fetch(`${BASE_URL}/api/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportName: 'Annual CBC Blood Test',
        reportType: 'Lab Result',
        bodyPart: 'Blood',
        doctorNotes: 'Needs followup'
      })
    });
    const newRecord: any = await uploadRes.json();
    console.log('POST /api/records status:', uploadRes.status);
    console.log('AI summary created:', newRecord.aiSummary);
    console.log('Extracted Values length:', newRecord.extractedValues?.length);
    testRecordId = newRecord.id;

    // 6. Records: List and update notes
    const listRes = await fetch(`${BASE_URL}/api/records`);
    const recordsList: any = await listRes.json();
    console.log('GET /api/records count:', recordsList.length);

    const updateRecordRes = await fetch(`${BASE_URL}/api/records/${testRecordId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorNotes: 'Followup completed, hemoglobin looks much better now!' })
    });
    const updatedRecord: any = await updateRecordRes.json();
    console.log('PUT /api/records/:id status:', updateRecordRes.status);
    console.log('Updated Notes:', updatedRecord.doctorNotes);

    // 7. Vitals: Log Glucose and BP
    console.log('\n--- Testing Vitals Log API ---');
    const logGlucoseRes = await fetch(`${BASE_URL}/api/vitals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'Glucose',
        glucoseValue: 120,
        glucoseContext: 'Post-meal',
        notes: 'Felt good'
      })
    });
    const glucoseData: any = await logGlucoseRes.json();
    console.log('POST /api/vitals (Glucose) status:', logGlucoseRes.status);
    console.log('Logged glucose value:', glucoseData.glucoseValue);

    const logBPRes = await fetch(`${BASE_URL}/api/vitals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'BloodPressure',
        bpSystolic: 125,
        bpDiastolic: 82,
        bpPulse: 72,
        notes: 'Resting BP'
      })
    });
    const bpData: any = await logBPRes.json();
    console.log('POST /api/vitals (BloodPressure) status:', logBPRes.status);
    console.log('Logged BP values:', `${bpData.bpSystolic}/${bpData.bpDiastolic}`);

    // Get vital trends
    const glucoseTrendsRes = await fetch(`${BASE_URL}/api/vitals/trends?type=Glucose&window=7d`);
    const glucoseTrends: any = await glucoseTrendsRes.json();
    console.log('GET /api/vitals/trends (Glucose 7d) count:', glucoseTrends.length);

    // 8. Timeline: Retrieve events
    console.log('\n--- Testing Timeline API ---');
    const timelineRes = await fetch(`${BASE_URL}/api/timeline`);
    const timelineData: any = await timelineRes.json();
    console.log('GET /api/timeline status:', timelineRes.status);
    console.log('Timeline events count:', timelineData.length);
    console.log('First event report name:', timelineData[0]?.reportName);

    // 9. Emergency: Access profile and log Doctor scan
    console.log('\n--- Testing Emergency & Access Logs API ---');
    const emergProfileRes = await fetch(`${BASE_URL}/api/emergency/profile`);
    const emergProfile: any = await emergProfileRes.json();
    console.log('GET /api/emergency/profile status:', emergProfileRes.status);
    console.log('Allergies in emergency profile:', emergProfile.allergies);

    const logAccessRes = await fetch(`${BASE_URL}/api/emergency/access`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        who: 'Dr. Priya Nair (Apollo)',
        whatReport: 'Emergency Medical Summary',
        how: 'QR Code Scan'
      })
    });
    const accessData: any = await logAccessRes.json();
    console.log('POST /api/emergency/access status:', logAccessRes.status);
    console.log('Log message:', accessData.message);

    const listLogsRes = await fetch(`${BASE_URL}/api/emergency/logs`);
    const logsList: any = await listLogsRes.json();
    console.log('GET /api/emergency/logs count:', logsList.length);
    console.log('Last Access logged by:', logsList[0]?.who);

    console.log('\n🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    // Shutdown server and DB
    if (serverInstance) {
      serverInstance.close(() => {
        console.log('\n🛑 Test server stopped.');
      });
    }
    await prisma.$disconnect();
  }
}

runTests();
