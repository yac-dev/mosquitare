import express from 'express';
const router = express.Router();
import { createLike, aggregateAllLikes, getConversationLikes } from '../controllers/likes';

router.route('/aggregateall').get(aggregateAllLikes);
router.route('/:conversationId').get(getConversationLikes);
router.route('/').post(createLike);

export default router;
