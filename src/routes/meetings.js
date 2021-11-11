import express from 'express';
const router = express.Router();
import { createMeeting, getMeetings } from '../controllers/meetings';

router.post('/', createMeeting);
router.get('/', getMeetings);
export default router;
