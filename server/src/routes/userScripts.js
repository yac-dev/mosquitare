import express from 'express';
const router = express.Router();
import { createUserScript } from '../controllers/userScripts';
import multerParser from '../middlewares/multer';

router.post('/upload/:id', multerParser.array('scriptFiles', 3), createUserScript);

export default router;
