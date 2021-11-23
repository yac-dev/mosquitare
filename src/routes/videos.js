import express from 'express';
const router = express.Router();
import { createVideo } from '../controllers/videos';
import multerParser from '../middlewares/multer';

// single()の意味はは、multipart fileを一つだけ受け付けるっていうこと。()内はfileのpropertyの役割を果たす。だから、reactでformdataを送る実装をする時は、videoFileっていうpropertyで送るように実装する。
router.post('/upload', multerParser.single('videoFile'), createVideo);

export default router;
