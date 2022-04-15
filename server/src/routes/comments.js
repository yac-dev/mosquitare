import express from 'express';
const router = express.Router();

import { createComment, getConversationComments, aggregateAllComments } from '../controllers/comments';

router.route('/aggregateall').get(aggregateAllComments);
router.route('/:conversationId/:userId').post(createComment);
router.route('/:conversationId').get(getConversationComments);

export default router;
