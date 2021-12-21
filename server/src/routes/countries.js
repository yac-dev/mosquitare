import express from 'express';
const router = express.Router();
import { getCountries } from '../controllers/countries';

router.get('/', getCountries);
export default router;
