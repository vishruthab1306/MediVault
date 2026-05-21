import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db';

const DEFAULT_USER_ID = 'default-user-id';

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !email.includes('@')) {
      res.status(400).json({ error: { message: 'A valid Gmail or email address is required' } });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({ error: { message: 'Password must be at least 6 characters long' } });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Clear out any previous sandbox user's data to ensure the new account has a completely clean slate
    await prisma.medicalRecord.deleteMany({ where: { userId: DEFAULT_USER_ID } });
    await prisma.timelineEvent.deleteMany({ where: { userId: DEFAULT_USER_ID } });
    await prisma.vitalReading.deleteMany({ where: { userId: DEFAULT_USER_ID } });
    await prisma.accessLog.deleteMany({ where: { userId: DEFAULT_USER_ID } });

    // Single-user upsert sandbox pattern to maintain full E2E record binding stability
    const user = await prisma.user.upsert({
      where: { id: DEFAULT_USER_ID },
      update: {
        email,
        passwordHash,
        name: null, // Clear out pre-filled mock details to trigger Welcome Board Onboarding!
        dob: null,
        gender: null,
        height: null,
        weight: null,
        bloodType: null,
        allergies: "[]",
        conditions: "[]",
        pastSurgeries: "[]",
        emergencyContactName: null,
        emergencyContactPhone: null,
        emergencyContactDetails: "{}"
      },
      create: {
        id: DEFAULT_USER_ID,
        email,
        passwordHash,
        allergies: "[]",
        conditions: "[]",
        pastSurgeries: "[]",
        emergencyContactDetails: "{}"
      }
    });

    res.status(200).json({
      message: 'Account registered successfully',
      userId: user.id
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: { message: 'Email and password are required' } });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: DEFAULT_USER_ID }
    });

    if (!user || !user.email) {
      res.status(404).json({ error: { message: 'No registered user found. Please register an account first.' } });
      return;
    }

    // Check if email matches
    if (user.email.toLowerCase() !== email.toLowerCase()) {
      res.status(401).json({ authenticated: false, error: { message: 'Incorrect email or password' } });
      return;
    }

    // Check if password hash is present and valid
    if (!user.passwordHash) {
      res.status(401).json({ authenticated: false, error: { message: 'Account has no password set. Please register.' } });
      return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      res.status(401).json({ authenticated: false, error: { message: 'Incorrect email or password' } });
      return;
    }

    // Parse stringified JSON arrays
    const formattedUser = {
      ...user,
      allergies: JSON.parse(user.allergies),
      conditions: JSON.parse(user.conditions),
      pastSurgeries: JSON.parse(user.pastSurgeries),
      emergencyContactDetails: JSON.parse(user.emergencyContactDetails),
      passwordHash: undefined // hide credentials hash
    };

    res.status(200).json({
      authenticated: true,
      user: formattedUser
    });
  } catch (error) {
    next(error);
  }
};
