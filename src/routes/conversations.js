import express from 'express';
const router = express.Router();
import {
  createConversation,
  updateConversationRecievedUser,
  updateConversationIntegratedUserMedia,
} from '../controllers/conversation';
import multerParser from '../middlewares/multer';
// import multer from 'multer';
// const multerParser = multer({ dest: 'uploadedFiles/' });

router.route('/').post(createConversation);
router.route('/:id').post(updateConversationRecievedUser);
router.route('/integratedusermedia/:id').patch(updateConversationIntegratedUserMedia);
// router.post('/upload/caller/:id', multerParser.single('videoFile'), storeVideoFileNames);
// router.post('/upload/reciever/:id', multerParser.single('videoFile'), storeVideoFileNames);

export default router;
