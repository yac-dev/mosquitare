import express from 'express';
const router = express.Router();
import { getDocByConversationId } from '../controllers/docs';

router.route('/:conversationId').get(getDocByConversationId);

export default router;
