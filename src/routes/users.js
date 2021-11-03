import express from 'express';
const router = express.Router();
import { signup, login, loadMeAndUpdate, getUsers, updateUsersSocketId } from '../controllers/users';
import { authorization } from '../middlewares/authorization';

router.post('/signup', signup);
router.post('/login', login);
router.patch('/loadmeandupdate', authorization, loadMeAndUpdate);

router.get('/', getUsers);
router.patch('/:id', updateUsersSocketId);

export default router;
