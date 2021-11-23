import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: `./config/.env.${process.env.NODE_ENV}` });
export const PORT = process.env.PORT;
export const MONGODB_URL = process.env.MONGODB_URL;
export const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
export const AWS_S3BUCKET_NAME = process.env.AWS_S3BUCKET_NAME;
export const AWS_S3BUCKET_REGION = process.env.AWS_S3BUCKET_REGION;
export const AWS_S3BUCKET_ACCESS_KEY = process.env.AWS_S3BUCKET_ACCESS_KEY;
export const AWS_S3BUCKET_SECRET_KEY = process.env.AWS_S3BUCKET_SECRET_KEY;
