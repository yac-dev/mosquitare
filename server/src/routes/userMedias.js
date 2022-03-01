import express from 'express';
const router = express.Router();
import { createUserMedia, getUserMedia } from '../controllers/userMedias';
import multerParser from '../middlewares/multer';

// single()の意味はは、multipart fileを一つだけ受け付けるっていうこと。()内はfileのpropertyの役割を果たす。だから、reactでformdataを送る実装をする時は、videoFileっていうpropertyで送るように実装する。
// arrayの場合は、request.filesでアクセスする。
router.post('/upload/:id/:conversationId', multerParser.single('mediaFile'), createUserMedia); //やっぱ、すべてこっちに提出することにする。
// router.post('/upload/:id/languagescripts', multerParser.array('textFiles', 2), updateUserMediaLanguageScripts);
router.get('/:key', getUserMedia);
// これを、calledUserMediaとrecievedUserMedia二つに対して読み込んでいく形になるな。

export default router;
