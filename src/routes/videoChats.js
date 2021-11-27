import express from 'express';
const router = express.Router();
import { createVideoChat, storeVideoFileNames } from '../controllers/videoChats';
import multerParser from '../middlewares/multer';
// import multer from 'multer';
// const multerParser = multer({ dest: 'uploadedFiles/' });

router.route('/').post(createVideoChat);
router.post('/upload/caller/:id', multerParser.single('videoFile'), storeVideoFileNames);
router.post('/upload/reciever/:id', multerParser.single('videoFile'), storeVideoFileNames);

export default router;
