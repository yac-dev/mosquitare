import express from 'express';
const router = express.Router();
import { createUserScript } from '../controllers/userScripts';
import multerParser from '../middlewares/multer';

router.post('/', multerParser.array('scriptFiles', 2), createUserScript);

export default router;
