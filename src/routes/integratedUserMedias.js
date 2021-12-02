import express from 'express';
const router = express.Router();
import { createIntegratedUserMedia } from '../controllers/integratedUserMedias';

router.post('/', createIntegratedUserMedia);

export default router;
