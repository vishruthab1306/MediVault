import { Router } from 'express';
import { logVital, getVitalTrends } from '../controllers/vitals';

const router = Router();

router.post('/', logVital);
router.get('/trends', getVitalTrends);

export default router;
