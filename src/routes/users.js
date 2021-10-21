import express from 'express';
const router = express.Router();
import { signup } from '../controllers/users';

router.get('/', signup);

export default router;
