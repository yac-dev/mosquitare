import path from 'path';
import mongoose from 'mongoose';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import dotenv from 'dotenv';

// dotenv.config({ path: path.join(__dirname, '../', '../', 'config/dev.env') });
// console.log(dotenv.config({ path: path.join(__dirname, '../', '../', 'config/dev.env') }));
import { MONGODB_URL } from '../../config';

mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('👍 Database connection succeeded 👍');
  })
  .catch((error) => {
    console.log('💩 Database connection failed... 💩');
    console.log(error);
  });
