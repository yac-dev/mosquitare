import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: `./config/.env.${process.env.NODE_ENV}` });
export const PORT = process.env.PORT;
export const MONGODB_URL = process.env.MONGODB_URL;
export const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
