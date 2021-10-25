import express from 'express';
const router = express.Router();
import { signup, login } from '../controllers/users';

router.post('/signup', signup);
router.post('/login', login);

export default router;
