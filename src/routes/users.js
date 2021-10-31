import express from 'express';
const router = express.Router();
import { signup, login, loadMe, getUsers } from '../controllers/users';
import { authorization } from '../middlewares/authorization';

router.post('/signup', signup);
router.post('/login', login);
router.get('/loadme', authorization, loadMe);

router.get('/', getUsers);

export default router;
