import IntegratedUserMedia from '../models/integratedUserMedia';

export const createIntegratedUserMedia = async (request, response) => {
  try {
    const integratedUserMedia = await IntegratedUserMedia.create(); // 一回まず作って、その後にこのid使ってupdateみたいにするか。
    response.json({
      integratedUserMedia,
    });
  } catch (error) {
    console.log(error);
  }
};
