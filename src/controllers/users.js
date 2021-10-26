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

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '10h' });

    response.json({
      user,
      jwtToken,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (request, response) => {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Nooooo.');
    }

    const isEnteredPasswordCorrect = await user.isPasswordCorrect(password, user.password);
    if (!isEnteredPasswordCorrect) {
      throw new Error('Nooooooo.');
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '10h' });

    response.json({
      user,
      jwtToken,
    });
  } catch (error) {
    console.log(error);
  }
};

export const loadMe = async (request, response) => {
  try {
    // まずは、post前提で作ろう。
    const { jwtToken } = request.body;
  } catch (error) {}
};
// authorization...
