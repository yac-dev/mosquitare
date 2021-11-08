import express from 'express';
const router = express.Router();
import {
  signup,
  login,
  loadMeAndUpdate,
  getUsers,
  updateUsersSocketId,
  updateUserConversationState,
  updateUserConversationToFalse,
  logout,
} from '../controllers/users';
import { authorization } from '../middlewares/authorization';

router.patch('/:id/conversation', updateUserConversationState);
router.patch('/:id/conversationtofalse', updateUserConversationToFalse);

router.post('/signup', signup);
router.post('/login', login);
router.patch('/loadmeandupdate', authorization, loadMeAndUpdate);

router.get('/', getUsers);
router.patch('/:id/logout', logout);
router.patch('/:id', updateUsersSocketId);

export default router;
