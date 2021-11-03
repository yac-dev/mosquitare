import User from '../models/user';
import jwt from 'jsonwebtoken';

import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../', '../', 'config/dev.env') });

export const authorization = async (request, response, next) => {
  try {
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
      let token = request.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY); // {id: _id}っていう形。
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new Error('No way....');
      }
      request.user = user;
      next();
    }
  } catch (error) {
    console.log(error);
  }
};
