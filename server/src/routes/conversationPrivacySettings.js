import express from 'express';
const router = express.Router();
import { updateConversationToPrivate, updateConversationToPublic } from '../controllers/conversationPrivacySettings';

router.route('/public/:conversationId').patch(updateConversationToPublic);
router.route('/private/:conversationId').patch(updateConversationToPrivate);

export default router;
