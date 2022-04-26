import express from 'express';
const router = express.Router();
import {
  createConversation,
  updateConversationUsers,
  updateConversationUserMedia,
  updateConversationUserScript,
  getConversation,
  getAllConversations,
  getMyConversations,
  getUserConversations,
  // updateConversationIntegratedUserMedia,
  // updateConversationDurationAndGenre,
} from '../controllers/conversation';
import multerParser from '../middlewares/multer';
// import multer from 'multer';
// const multerParser = multer({ dest: 'uploadedFiles/' });

router.route('/mine').post(getMyConversations);
router.route('/').get(getAllConversations).post(createConversation);
router.route('/:id').post(updateConversationUsers).get(getConversation);
router.route('/:id/usermedia').patch(updateConversationUserMedia);
router.route('/:id/userscript').patch(updateConversationUserScript);
router.route('/:userId/userconversations').get(getUserConversations);
// router.route('/:id/durationandgenre').patch(updateConversationDurationAndGenre);
// router.route('/integratedusermedia/:id').patch(updateConversationIntegratedUserMedia);

// router.post('/upload/caller/:id', multerParser.single('videoFile'), storeVideoFileNames);
// router.post('/upload/reciever/:id', multerParser.single('videoFile'), storeVideoFileNames);

export default router;
