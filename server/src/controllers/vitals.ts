import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

const DEFAULT_USER_ID = 'default-user-id';

export const logVital = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type, glucoseValue, glucoseContext, bpSystolic, bpDiastolic, bpPulse, dateTime, notes } = req.body;

    if (!type || (type !== 'Glucose' && type !== 'BloodPressure')) {
      res.status(400).json({ error: { message: "Type must be 'Glucose' or 'BloodPressure'" } });
      return;
    }

    const logDate = dateTime ? new Date(dateTime) : new Date();

    const reading = await prisma.vitalReading.create({
      data: {
        userId: DEFAULT_USER_ID,
        type,
        glucoseValue: glucoseValue !== undefined ? parseFloat(glucoseValue) : null,
        glucoseContext: glucoseContext || null,
        bpSystolic: bpSystolic !== undefined ? parseFloat(bpSystolic) : null,
        bpDiastolic: bpDiastolic !== undefined ? parseFloat(bpDiastolic) : null,
        bpPulse: bpPulse !== undefined ? parseFloat(bpPulse) : null,
        dateTime: logDate,
        notes: notes || null
      }
    });

    res.status(201).json(reading);
  } catch (error) {
    next(error);
  }
};

export const getVitalTrends = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type, window } = req.query; // type: Glucose/BloodPressure, window: 7d/30d/90d

    if (!type || (type !== 'Glucose' && type !== 'BloodPressure')) {
      res.status(400).json({ error: { message: "Type parameter must be 'Glucose' or 'BloodPressure'" } });
      return;
    }

    let days = 7;
    if (window === '30d') days = 30;
    else if (window === '90d') days = 90;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const readings = await prisma.vitalReading.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        type: String(type),
        dateTime: {
          gte: startDate
        }
      },
      orderBy: {
        dateTime: 'asc'
      }
    });

    res.status(200).json(readings);
  } catch (error) {
    next(error);
  }
};
