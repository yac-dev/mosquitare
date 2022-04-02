import express from 'express';
const router = express.Router();
import { getTranscriptsByConversationId } from '../controllers/transcripts';

router.route('/:conversationId', getTranscriptsByConversationId);

export default router;
