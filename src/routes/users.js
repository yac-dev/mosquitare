import express from 'express';
const router = express.Router();
import { signup } from '../controllers/users';

router.post('/signup', signup);

export default router;
