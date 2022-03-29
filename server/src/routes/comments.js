import express from 'express';
const router = express.Router();

import { createComment, getConversationComments } from '../controllers/comments';

router.route('/:conversationId/:userId').post(createComment);
router.route('/:conversationId').get(getConversationComments);
export default router;
