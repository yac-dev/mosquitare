import VideoChat from '../models/videoChat';

export const createVideoChat = async (request, response) => {
  try {
    const { callerUserId } = request.body;
    const videoChat = await new VideoChat({
      callerUser: callerUserId,
    });

    videoChat.save();
    response.json({
      videoChat,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateVideoChatStream = async (request, response) => {
  try {
    // bodyは、{callerUserStream: streamObject}みたいな感じになるね。もしくは{recieverUserStream: streamObject}
    const videoChat = await VideoChat.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: false,
    });
    // videoChat.callerUserStream = request.body.stream; c=conversationStateのところもそうだけど、この書き方する時はawait doc.save()ね。
    response.json({
      videoChat,
    });
  } catch (error) {
    console.log(error);
  }
};

// export const updateVideoChatForReciever = async (request, response) => {
//   try {
//     const videoChat = await VideoChat.findByIdAndUpdate(request.params.id, request.body, {
//       new: true,
//       runValidators: false,
//     });
//   } catch (error) {
//     console.log(error)
//   }
// };
