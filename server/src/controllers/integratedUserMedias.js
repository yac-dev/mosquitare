import IntegratedUserMedia from '../models/integratedUserMedia';

export const createIntegratedUserMedia = async (request, response) => {
  try {
    const integratedUserMedia = await IntegratedUserMedia.create({}); // 一回まず作って、その後にこのid使ってupdateみたいにするか。
    console.log(integratedUserMedia);
    response.json({
      integratedUserMedia,
    });
  } catch (error) {
    console.log(error);
  }
}; // これ作った後に、conversationの方に入れなきゃだよな。多分。

export const updateIntegratedUserMedia = async (request, response) => {
  try {
    const integratedUserMedia = await IntegratedUserMedia.findById(request.params.id);
    if (request.body.calledUserMedia) {
      integratedUserMedia.calledUserMedia = request.body.calledUserMedia;
    } else if (request.body.recievedUserMedia) {
      integratedUserMedia.recievedUserMedia = request.body.recievedUserMedia;
    }
    await integratedUserMedia.save();
    response.status(200).json({
      integratedUserMedia,
    });
  } catch (error) {
    console.log(error);
  }
};
