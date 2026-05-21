import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

const DEFAULT_USER_ID = 'default-user-id';

export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: DEFAULT_USER_ID }
    });

    if (!user) {
      res.status(404).json({ error: { message: 'Profile not found' } });
      return;
    }

    res.status(200).json({
      ...user,
      allergies: JSON.parse(user.allergies),
      conditions: JSON.parse(user.conditions),
      pastSurgeries: JSON.parse(user.pastSurgeries),
      emergencyContactDetails: JSON.parse(user.emergencyContactDetails || '{}'),
      passwordHash: undefined,
      pinHash: undefined
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      name,
      dob,
      gender,
      height,
      weight,
      bloodType,
      allergies,
      conditions,
      pastSurgeries,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactDetails,
      email
    } = req.body;

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (dob !== undefined) updates.dob = dob;
    if (gender !== undefined) updates.gender = gender;
    if (height !== undefined) updates.height = height !== null ? String(height) : null;
    if (weight !== undefined) updates.weight = weight !== null ? String(weight) : null;
    if (bloodType !== undefined) updates.bloodType = bloodType;
    if (emergencyContactName !== undefined) updates.emergencyContactName = emergencyContactName;
    if (emergencyContactPhone !== undefined) updates.emergencyContactPhone = emergencyContactPhone;
    if (email !== undefined) updates.email = email;

    if (allergies !== undefined) {
      updates.allergies = JSON.stringify(Array.isArray(allergies) ? allergies : []);
    }
    if (conditions !== undefined) {
      updates.conditions = JSON.stringify(Array.isArray(conditions) ? conditions : []);
    }
    if (pastSurgeries !== undefined) {
      updates.pastSurgeries = JSON.stringify(Array.isArray(pastSurgeries) ? pastSurgeries : []);
    }
    if (emergencyContactDetails !== undefined) {
      updates.emergencyContactDetails = JSON.stringify(emergencyContactDetails || {});
    }

    const user = await prisma.user.update({
      where: { id: DEFAULT_USER_ID },
      data: updates
    });

    res.status(200).json({
      ...user,
      allergies: JSON.parse(user.allergies),
      conditions: JSON.parse(user.conditions),
      pastSurgeries: JSON.parse(user.pastSurgeries),
      emergencyContactDetails: JSON.parse(user.emergencyContactDetails || '{}'),
      passwordHash: undefined,
      pinHash: undefined
    });
  } catch (error) {
    next(error);
  }
};
