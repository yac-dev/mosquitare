import Language from '../models/language';

export const getLanguages = async (request, response) => {
  try {
    const languages = await Language.find();
    response.send(languages);
  } catch (error) {
    console.log(error);
  }
};
