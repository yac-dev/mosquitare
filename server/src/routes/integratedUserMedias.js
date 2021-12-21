import express from 'express';
const router = express.Router();
import {
  createIntegratedUserMedia,
  updateIntegratedUserMediaCalledUserMedia,
} from '../controllers/integratedUserMedias';

router.post('/', createIntegratedUserMedia);
router.patch('/calleduser/:id', updateIntegratedUserMediaCalledUserMedia);
// router.patch('/recieveduser/:id', updateIntegratedUserMediaRecievedUserMedia);

export default router;
