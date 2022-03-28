import express from 'express';
const router = express.Router();

import { createComment, getComments } from '../controllers/comments';

router.route('/:conversationId').get(getComments);
router.route('/:conversationId/:userId').post(createComment);
export default router;
