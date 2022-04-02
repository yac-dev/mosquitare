import express from 'express';
const router = express.Router();
import { getTranscriptsByConversationId } from '../controllers/transcripts';

router.route('/:conversationId').get(getTranscriptsByConversationId);

export default router;
