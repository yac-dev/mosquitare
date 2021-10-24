import User from '../models/user';

export const signup = async (request, response, next) => {
  try {
    const user = await User.create({
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
      nativeLangs: request.body.nativeLangs,
      learningLangs: request.body.learningLangs,
      level: request.body.level,
      natinnalities: request.body.nationalities,
      description: request.body.description,
      job: request.body.job,
    });

    response.json({
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};
