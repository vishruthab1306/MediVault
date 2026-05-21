import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.clear();
  console.log('\x1b[36m==========================================================================================\x1b[0m');
  console.log('\x1b[36m🔒 MEDIVAULT SYSTEM ADMIN & PRESENTATION CONSOLE\x1b[0m');
  console.log('\x1b[36m==========================================================================================\x1b[0m');

  console.log('\n\x1b[35m👤 REGISTERED PATIENT PROFILES\x1b[0m');
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  if (users.length === 0) {
    console.log('   No registered users found.');
  } else {
    const userTable = users.map(u => {
      let ecName = 'None';
      try {
        const details = JSON.parse(u.emergencyContactDetails || '{}');
        ecName = details.name || u.emergencyContactName || 'None';
      } catch (e) {}

      return {
        'Name': u.name || 'Not Onboarded Yet',
        'Email': u.email || 'None',
        'DOB/Age': u.dob || 'None',
        'Ht (cm)': u.height || '--',
        'Wt (kg)': u.weight || '--',
        'Blood': u.bloodType || '--',
        'Allergies Count': JSON.parse(u.allergies || '[]').length,
        'Chronic Conditions': JSON.parse(u.conditions || '[]').join(', ') || 'None',
        'Emergency Contact': ecName
      };
    });
    console.table(userTable);
  }

  console.log('\n\x1b[35m📄 SCAN UPLOADS & MEDICAL RECORDS\x1b[0m');
  const records = await prisma.medicalRecord.findMany({
    orderBy: { createdAt: 'desc' }
  });

  if (records.length === 0) {
    console.log('   No medical records uploaded yet.');
  } else {
    const recordTable = records.map(r => ({
      'Record Name': r.reportName,
      'Type': r.reportType,
      'Extracted Patient': r.patientName,
      'Condition': r.detectedCondition,
      'Doctor Notes': r.doctorNotes || 'None',
      'AI Summary Snippet': r.aiSummary.length > 60 ? r.aiSummary.substring(0, 60) + '...' : r.aiSummary,
      'Uploaded On': new Date(r.createdAt).toLocaleDateString()
    }));
    console.table(recordTable);
  }

  console.log('\n\x1b[35m🫀 LOGGED VITALS READINGS (LATEST 10)\x1b[0m');
  const vitals = await prisma.vitalReading.findMany({
    orderBy: { dateTime: 'desc' },
    take: 10
  });

  if (vitals.length === 0) {
    console.log('   No vital readings logged yet.');
  } else {
    const vitalsTable = vitals.map(v => {
      const isBP = v.type === 'BloodPressure';
      return {
        'Vital Type': isBP ? '🫀 Blood Pressure' : '🍬 Glucose Level',
        'Reading Value': isBP ? `${v.bpSystolic}/${v.bpDiastolic} mmHg (Pulse: ${v.bpPulse || '--'})` : `${v.glucoseValue} mg/dL`,
        'Context / State': isBP ? '--' : v.glucoseContext || 'Random',
        'Timestamp': new Date(v.dateTime).toLocaleString(),
        'Self Notes': v.notes || 'None'
      };
    });
    console.table(vitalsTable);
  }

  console.log('\n\x1b[36m==========================================================================================\x1b[0m');
}

main()
  .catch((e) => {
    console.error('Failed to read database records:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
