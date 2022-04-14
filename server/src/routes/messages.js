import express from 'express';
const router = express.Router();
import { createMessage } from '../controllers/messages';

router.route('/:senderId/:recipientId').post(createMessage);

export default router;
