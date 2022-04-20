import express from 'express';
const router = express.Router();

router.route('/:conversationId/:userFrom/:userTo').post();

export default router;
