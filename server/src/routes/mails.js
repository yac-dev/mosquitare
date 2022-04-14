import express from 'express';
const router = express.Router();
import { createMail } from '../controllers/mails';

router.route('/:senderId/:recipientId').post(createMail);

export default router;
