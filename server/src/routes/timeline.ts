import { Router } from 'express';
import { getTimeline } from '../controllers/timeline';

const router = Router();

router.get('/', getTimeline);

export default router;
