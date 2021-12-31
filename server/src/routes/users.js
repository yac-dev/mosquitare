import express from 'express';
const router = express.Router();
import {
  signup,
  login,
  loadMe,
  updateUserSocketId,
  loadMeAndUpdate,
  getUsers,
  updateUsersSocketId,
  updateUserConversationState,
  updateUserConversationToFalse,
  logout,
} from '../controllers/users';
import { authorization } from '../middlewares/authorization';

router.patch('/:id/conversation', updateUserConversationState); // ここら辺、authorizationのmiddlewareを使えばいいな。
router.patch('/:id/conversationtofalse', updateUserConversationToFalse); // ここも。

router.post('/signup', signup);
router.post('/login', login);
router.get('/loadme', authorization, loadMe); // これと、
router.patch('/socketid', updateUserSocketId); // この二つに分けたほうがいいや。
router.patch('/loadmeandupdate', authorization, loadMeAndUpdate);

router.get('/', getUsers);
router.patch('/:id/logout', logout);
router.patch('/:id', updateUsersSocketId); // ここも。

export default router;
