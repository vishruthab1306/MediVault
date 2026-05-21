import { Router } from 'express';
import { getEmergencyProfile, logEmergencyAccess, listAccessLogs } from '../controllers/emergency';

const router = Router();

router.get('/profile', getEmergencyProfile);
router.post('/access', logEmergencyAccess);
router.get('/logs', listAccessLogs);

export default router;
