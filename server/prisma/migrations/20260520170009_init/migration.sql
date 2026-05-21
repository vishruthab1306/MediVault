-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pinHash" TEXT NOT NULL,
    "name" TEXT,
    "dob" TEXT,
    "gender" TEXT,
    "height" TEXT,
    "weight" TEXT,
    "bloodType" TEXT,
    "allergies" TEXT NOT NULL DEFAULT '[]',
    "conditions" TEXT NOT NULL DEFAULT '[]',
    "pastSurgeries" TEXT NOT NULL DEFAULT '[]',
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MedicalRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "reportName" TEXT NOT NULL,
    "scanDate" TEXT NOT NULL,
    "scanTime" TEXT NOT NULL,
    "reportDate" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "bodyPart" TEXT NOT NULL,
    "detectedCondition" TEXT NOT NULL,
    "labHospital" TEXT NOT NULL,
    "referringDoctor" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "aiProcessed" BOOLEAN NOT NULL DEFAULT false,
    "cloudSynced" BOOLEAN NOT NULL DEFAULT true,
    "aiSummary" TEXT NOT NULL,
    "doctorNotes" TEXT NOT NULL,
    "extractedValues" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MedicalRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "reportName" TEXT NOT NULL,
    "snippet" TEXT NOT NULL,
    "conditionCluster" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TimelineEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TimelineEvent_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "MedicalRecord" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VitalReading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "glucoseValue" REAL,
    "glucoseContext" TEXT,
    "bpSystolic" REAL,
    "bpDiastolic" REAL,
    "bpPulse" REAL,
    "dateTime" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VitalReading_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AccessLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "who" TEXT NOT NULL,
    "whatReport" TEXT NOT NULL,
    "when" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "how" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AccessLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
