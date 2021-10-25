import User from '../models/user';
import jwt from 'jsonwebtoken';

import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../', '../', 'config/dev.env') });

export const signup = async (request, response, next) => {
  try {
    const { name, email, password, passwordConfirmation, nativeLangs, learningLangs, nationalities, job } =
      request.body;
    const user = await User.create({
      name,
      email,
      password,
      passwordConfirmation,
      nativeLangs,
      learningLangs,
      nationalities,
      job,
    });

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log(jwtToken);

    response.json(user);
  } catch (error) {
    console.log(error);
  }
};
