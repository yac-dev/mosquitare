import User from '../models/user';
import jwt from 'jsonwebtoken';

import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import dotenv from 'dotenv';
// import bcrypt from 'bcryptjs';
import bcrypt from 'bcrypt';

dotenv.config({ path: path.join(__dirname, '../', '../', 'config/dev.env') });

export const signup = async (request, response, next) => {
  try {
    const {
      name,
      email,
      password,
      passwordConfirmation,
      nativeLangs,
      learningLangs,
      nationalities,
      job,
      location,
      socketId,
    } = request.body;

    const user = await new User({
      name,
      email,
      password,
      passwordConfirmation,
      nativeLangs,
      learningLangs,
      nationalities,
      job,
      location,
      socketId,
    });
    // location, socketに関してはbrowserから取得してpostするようにしよう。
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.save();

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '10d' });

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
    console.log(email, password);

    const user = await User.findOne({ email });
    // const hashed = await bcrypt.hash(password, 12);
    // console.log(hashed, user.password);
    if (!user) {
      throw new Error('Nooooo.mail');
    }
    console.log(user);

    const isEnteredPasswordCorrect = await user.isPasswordCorrect(password, user.password);
    if (!isEnteredPasswordCorrect) {
      // つまりfalseということ。
      return new Error(isEnteredPasswordCorrect);
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '10d' });
    // ここで、このuserのlocation, socket、isOnlineを全て更新しよう。
    // 基本、logoutとpage closeしたらlocation、socket、isOnlineを全部消すようにupdateするからね。

    // user.location = location; 一旦これはなし。
    // user.socketId = socketId;
    user.isOnline = true;
    await user.save({ validateBeforeSave: false });

    response.json({
      user,
      jwtToken,
    });
  } catch (error) {
    console.log(error.message, error.name);
  }
};

export const loadMeAndUpdate = async (request, response) => {
  try {
    const { user } = request;
    console.log(request.body.socketId);
    user.socketId = request.body.socketId;
    await user.save({ validateBeforeSave: false });
    response.json({ user });
  } catch (error) {
    console.log(error);
  }
};

export const getUsers = async (request, response) => {
  try {
    const users = await User.find();
    response.json({
      users,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateUsersSocketId = async (request, response) => {
  try {
    // socketだけにしてーな。
    // const { socketId } = request.body;
    const user = await User.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });
    response.json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

// こっちは、isInConversation用のhandler、でもrefactoringできるな,最終的に。
export const updateUserConversationState = async (request, response) => {
  try {
    const user = await User.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });
    response.json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (request, response) => {
  try {
    await User.findByIdAndUpdate(request.params.id, { isOnline: false }, { new: true, runValidators: true }); // これできたっけ？？
    // あとは、client側でやる感じだな。
  } catch (error) {
    console.log(error);
  }
};
