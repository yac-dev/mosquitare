import express from 'express';
const router = express.Router();
import { signup, login, loadMe } from '../controllers/users';
import { authorization } from '../middlewares/authorization';

router.post('/signup', signup);
router.post('/login', login);

router.get('/loadme', authorization, loadMe);

export default router;
