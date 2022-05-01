import express from 'express';
const router = express.Router();
import { createMessage, getMyMessages } from '../controllers/messages';

router.route('/mine').post(getMyMessages);
router.route('/:senderId/:recipientId').post(createMessage);

export default router;
