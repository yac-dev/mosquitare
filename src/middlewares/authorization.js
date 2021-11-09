import User from '../models/user';
import jwt from 'jsonwebtoken';

import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import dotenv from 'dotenv';

import { JWT_PRIVATE_KEY } from '../../config';

dotenv.config({ path: path.join(__dirname, '../', '../', 'config/dev.env') });

export const authorization = async (request, response, next) => {
  try {
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
      let token = request.headers.authorization.split(' ')[1];
      if (!token) {
        console.log('No token.....');
      } // signup後、token自体があることは確認できる。
      const decoded = jwt.verify(token, JWT_PRIVATE_KEY); // {id: _id}っていう形。
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new Error('Cant find that user');
      }
      request.user = user;
      next();
    }
  } catch (error) {
    console.log(error);
  }
};
