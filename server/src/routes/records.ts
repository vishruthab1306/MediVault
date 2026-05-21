import { Router } from 'express';
import { listRecords, getRecordDetails, createRecord, updateRecord, deleteRecord } from '../controllers/records';

const router = Router();

router.get('/', listRecords);
router.get('/:id', getRecordDetails);
router.post('/', createRecord);
router.put('/:id', updateRecord);
router.delete('/:id', deleteRecord);

export default router;
