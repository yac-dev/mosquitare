import express from 'express';
const router = express.Router();
import { createMessage, getMyMessages, updateUnreadToRead, getMessagesWithUser } from '../controllers/messages';

router.route('/mine').post(getMyMessages);
router.route('/unreadtoread').patch(updateUnreadToRead);
router.route('/user').post(getMessagesWithUser);
router.route('/:senderId/:recipientId').post(createMessage);

export default router;
