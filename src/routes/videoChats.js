import express from 'express';
const router = express.Router();
import { createVideoChat } from '../controllers/videoChats';

router.post('/', createVideoChat);

export default router;
