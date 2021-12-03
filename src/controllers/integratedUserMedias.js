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
}; // これ作った後に、conversationの方に入れなきゃだよな。多分。

export const updateIntegratedUserMediaCalledUserMedia = (request, response) => {
  try {
    const integratedUserMedia = await IntegratedUserMedia.findById(request.params.id);
    integratedUserMedia.calledUserMedia = request.body.calledUserMedia;
    await integratedUserMedia.save();
  } catch (error) {
    console.log(error);
  }
};
