import User from '../models/user';

export const signup = async (request, response, next) => {
  try {
    const { name, email, password, languages, nationalities, job, location } = request.body;
    const user = await User.create({
      name,
      email,
      password,
      languages,
      nationalities,
      job,
      location,
    });

    response.json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
