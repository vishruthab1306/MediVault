import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

const DEFAULT_USER_ID = 'default-user-id';

export const getEmergencyProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: DEFAULT_USER_ID }
    });

    if (!user) {
      res.status(404).json({ error: { message: 'Emergency profile not found' } });
      return;
    }

    res.status(200).json({
      name: user.name,
      dob: user.dob,
      gender: user.gender,
      bloodType: user.bloodType,
      allergies: JSON.parse(user.allergies),
      conditions: JSON.parse(user.conditions),
      emergencyContactName: user.emergencyContactName,
      emergencyContactPhone: user.emergencyContactPhone
    });
  } catch (error) {
    next(error);
  }
};

export const logEmergencyAccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { who, whatReport, how } = req.body;

    const log = await prisma.accessLog.create({
      data: {
        userId: DEFAULT_USER_ID,
        who: who || 'Unknown Paramedic',
        whatReport: whatReport || 'Emergency Card Scan',
        how: how || 'QR Code'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Emergency access logged successfully',
      log
    });
  } catch (error) {
    next(error);
  }
};

export const listAccessLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const logs = await prisma.accessLog.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { when: 'desc' }
    });

    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};
