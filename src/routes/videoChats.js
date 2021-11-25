import express from 'express';
const router = express.Router();
import { createVideoChat, updateVideoChatStream } from '../controllers/videoChats';

router.route('/').post(createVideoChat);

router.route('/updatestream/:id').patch(updateVideoChatStream);

export default router;
