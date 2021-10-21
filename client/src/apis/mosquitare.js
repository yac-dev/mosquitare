import axios from 'axios';
import dotenv from 'dotenv';
import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../', '../', '.env') });

export const mosquitareAPI = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  mode: 'cors',
});
