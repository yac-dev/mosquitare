import express from 'express';
const router = express.Router();
import { createVideoChat, updateVideoChatStream, getStream } from '../controllers/videoChats';
import multerParser from '../middlewares/multer';
// import multer from 'multer';
// const multerParser = multer({ dest: 'uploadedFiles/' });

router.route('/').post(createVideoChat);
router.route('/:id').get(getStream);
router.post('/updatestream/:id', multerParser.single('videoFile'), updateVideoChatStream);

export default router;
