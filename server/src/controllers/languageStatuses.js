import LanguageStatus from '../models/languageStatus';

export const createLanguageStatus = async (request, response) => {
  try {
    const languageStatus = await LanguageStatus.create({});
    response.status(201).json({
      languageStatus,
    });
  } catch (error) {
    console.log(error);
  }
};
