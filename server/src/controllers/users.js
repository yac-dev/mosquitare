import User from '../models/user';
import City from '../models/city';
import mongoose from 'mongoose';

import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
import bcrypt from 'bcrypt';
import { JWT_PRIVATE_KEY } from '../../config';

// export const signup = async (request, response, next) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       passwordConfirmation,
//       nativeLangs,
//       learningLangs,
//       nationalities,
//       job,
//       location,
//       socketId,
//     } = request.body;

//     const user = await new User({
//       name,
//       email,
//       password,
//       passwordConfirmation,
//       nativeLangs,
//       learningLangs,
//       nationalities,
//       job,
//       location,
//       socketId,
//     });
//     // location, socketに関してはbrowserから取得してpostするようにしよう。
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);
//     user.save();

//     const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '10d' });

//     response.json({
//       user,
//       jwtToken,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const signup = async (request, response) => {
  try {
    const {
      name,
      email,
      password,
      passwordConfirmation,
      nativeLangs, // [langのid, langのid]って感じ。来たのはただの文字列だから、new ObjectIdでやる。
      learningLangs, // [langのid, langのid]
      nationalities, // [countryのid, countryのid]
      location, // citiesから、来たcountryのidを使ってrandomなcityをpickする。そのlngとlatを入れる感じ。
      photo,
    } = request.body;

    const city = await City.aggregate([
      {
        $match: {
          country: mongoose.Types.ObjectId(location),
        },
      },
      { $sample: { size: 1 } },
    ]);

    const myLangs = [];
    for (let i = 0; i < nativeLangs.length; i++) {
      myLangs.push(mongoose.Types.ObjectId(nativeLangs[i]));
    }
    for (let i = 0; i < learningLangs.length; i++) {
      myLangs.push(mongoose.Types.ObjectId(learningLangs[i]));
    } // generate myLangs

    const myLangsStatus = new Array(myLangs.length).fill(0);

    const user = await new User({
      name: name,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation,
      nativeLangs: nativeLangs.map((lang) => mongoose.Types.ObjectId(lang)),
      learningLangs: learningLangs.map((lang) => mongoose.Types.ObjectId(lang)),
      myLangs: myLangs,
      myLangsStatus: myLangsStatus,
      nationalities: nationalities.map((nationality) => mongoose.Types.ObjectId(nationality)),
      location: {
        type: 'Point',
        coordinates: [city[0].location.coordinates[0], city[0].location.coordinates[1]],
      },
      socketId: '11111',
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.save();

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '10d' });
    response.status(201).send({
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
    if (!user) {
      throw new Error('Nooooo.mail');
    }
    console.log(user);

    const isEnteredPasswordCorrect = await user.isPasswordCorrect(password, user.password);
    if (!isEnteredPasswordCorrect) {
      return new Error(isEnteredPasswordCorrect);
    }

    const jwtToken = jwt.sign({ id: user._id }, JWT_PRIVATE_KEY, { expiresIn: '10d' });
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

// これ、loadme、そしてsocketIdのupdateを分けたほうがいいな。。。。
export const loadMe = async (request, response) => {
  try {
    const { user } = request;
    response.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateUserSocketId = async (request, response) => {
  try {
    // bodyにsocketIdが入るようにする。
    console.log(request.body.socketId);
  } catch (error) {
    console.log(error);
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

// const updateFunc = async (request, response, field) => {
//   try {
//     const user = await User.findByIdAndUpdate(
//       request.params.id,
//       { isInConversation: true },
//       { new: true, runValidators: true }
//     );
//     response.json({
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

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
    const user = await User.findByIdAndUpdate(
      request.params.id,
      { isInConversation: true },
      { new: true, runValidators: true }
    );
    response.json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (request, response) => {
  try {
    const user = await User.findByIdAndUpdate(
      request.params.id,
      { isOnline: false },
      { new: true, runValidators: true }
    );
    response.json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateUserConversationToFalse = async (request, response) => {
  try {
    const user = await User.findByIdAndUpdate(
      request.params.id,
      { isInConversation: false },
      { new: true, runValidators: true }
    );
    response.json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateConversation = async (request, response) => {
  try {
    // 多分、userのinstanceをまんま送るのがベストかね。loadmeandUpdateもそうだけど。そのinstanceのfieldを変更して、saveするっていうのが一番早いしqueryの必要がなくなる。
    const { conversationId } = request.body;
    const user = await User.findById(request.params.id);
    user.conversations.push(conversationId);
    await user.save(); // TypeError: user.save is not a function これだめってなるね。。。考え直そう。
    response.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
