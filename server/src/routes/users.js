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
  updateConversation,
  updateLangsStatus,
  updateIsAvailableToFalse,
  updateIsAvailableToFalseById,
} from '../controllers/users';
import { authorization } from '../middlewares/authorization';

router.patch('/:id/conversation', updateUserConversationState); // ここら辺、authorizationのmiddlewareを使えばいいな。ここ, totrueとかに名前変えたほうがいいな。
router.patch('/:id/conversationtofalse', updateUserConversationToFalse); // ここも。

router.patch('/:id/conversations', updateConversation);

router.post('/signup', signup);
router.post('/login', login);
router.get('/loadme', authorization, loadMe); // これと、
router.patch('/socketid', updateUserSocketId); // この二つに分けたほうがいいや。
router.patch('/loadmeandupdate', authorization, loadMeAndUpdate);
router.patch('/isavailablenow', authorization, updateIsAvailableToFalse);
router.patch('/:id/isavailablenow', updateIsAvailableToFalseById);

router.get('/', getUsers);
router.patch('/:id/logout', logout);
router.patch('/:id', updateUsersSocketId); // ここも。

router.patch('/:id/langsstatus', updateLangsStatus);

export default router;
