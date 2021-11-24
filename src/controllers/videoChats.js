import VideoChat from '../models/videoChat';

export const createVideoChat = async (request, response) => {
  try {
    const { callerUserId } = request.body;
    const videoChat = await new VideoChat({
      callerUser: callerUserId,
    });
    response.json({
      videoChat,
    });
  } catch (error) {
    console.log(error);
  }
};
