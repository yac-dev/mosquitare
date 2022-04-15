import express from 'express';
const router = express.Router();
import { createLike } from '../controllers/likes';

router.route('/').post(createLike);

export default router;
