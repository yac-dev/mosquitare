import express from 'express';
const router = express.Router();
import { createRating } from '../controllers/ratings';

router.route('/').post(createRating);

export default router;
