import express from 'express';
const router = express.Router();
import { getLanguages } from '../controllers/languages';

router.get('/', getLanguages);

export default router;
