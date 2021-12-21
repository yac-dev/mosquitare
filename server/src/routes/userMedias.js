import express from 'express';
const router = express.Router();
import { createUserMedia } from '../controllers/userMedias';
import multerParser from '../middlewares/multer';

// single()の意味はは、multipart fileを一つだけ受け付けるっていうこと。()内はfileのpropertyの役割を果たす。だから、reactでformdataを送る実装をする時は、videoFileっていうpropertyで送るように実装する。
// arrayの場合は、request.filesでアクセスする。
router.post('/upload/:id', multerParser.array('mediaFiles', 2), createUserMedia);

export default router;
