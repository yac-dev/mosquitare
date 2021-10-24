import Language from '../models/language';

export const getLanguages = async (request, response) => {
  try {
    const languages = await Language.find();
    response.send(languages); // 簡単に結果を返したい場合はこれでいいかもな
  } catch (error) {
    console.log(error);
  }
};
