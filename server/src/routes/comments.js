import express from 'express';
const router = express.Router();

import { createComment } from '../controllers/comments';

router.route('/:conversationId/:userId').post(createComment);

export default router;
