import User from '../models/user';

export const signup = async (request, response, next) => {
  try {
    const { name, email, password, nativeLangs, learningLangs, nationalities, job } = request.body;
    const user = await User.create({ name, email, password, nativeLangs, learningLangs, nationalities, job });

    response.json(user);
  } catch (error) {
    console.log(error);
  }
};
